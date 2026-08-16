import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { runAiMigration } from '../lib/ai/run.js';
import { getUserId } from '../lib/auth/verify.js';

/**
 * POST /api/migrate-ai
 * Body: { html: string, ts?: string, deterministic: {code, imports, report}, deep?: boolean }
 * Returns: { html, ts, changes, unresolved, model, corrected, usage }
 *
 * The deterministic codemod runs in the browser; this only does the AI "finish" step.
 * Key is server-side (ANTHROPIC_API_KEY env var) — never sent to the client.
 *
 * Requires a signed-in user (Authorization: Bearer <Clerk token>) — the /migrate/* routes
 * are gated behind sign-in in the UI, and this endpoint enforces the same requirement
 * server-side rather than relying on the UI guard alone.
 */

// Real, persistent rate limit — a fixed daily window per signed-in user, backed by
// Upstash Redis (provisioned via the Vercel Marketplace; see ADR "Upstash Redis for a
// real rate limiter"). Replaces the old in-memory Map, which reset on every cold start.
const DAILY_LIMIT = Number(process.env.MIGRATE_DAILY_LIMIT) || 500;

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(DAILY_LIMIT, '1 d'),
  prefix: 'migrate-ai:user',
});

export default async function handler(
  req: {
    method?: string;
    headers: Record<string, string | string[] | undefined>;
    body: unknown;
  },
  res: {
    status: (code: number) => { json: (body: unknown) => void };
  },
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server is not configured (missing ANTHROPIC_API_KEY).' });
    return;
  }
  if (!process.env.CLERK_SECRET_KEY) {
    res.status(500).json({ error: 'Server is not configured (missing CLERK_SECRET_KEY).' });
    return;
  }

  const userId = await getUserId(req);
  if (!userId) {
    res.status(401).json({ error: 'Sign in to use Migrate with AI.' });
    return;
  }

  const { success } = await ratelimit.limit(userId);
  if (!success) {
    res.status(429).json({ error: `Daily limit reached (${DAILY_LIMIT}/day). Try again tomorrow.` });
    return;
  }

  const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as {
    html?: string;
    ts?: string;
    deterministic?: { code: string; imports: string[]; report: { mapped: string[]; manual: string[]; unsupported: string[] } };
    deep?: boolean;
  };

  if (!body?.html || !body?.deterministic) {
    res.status(400).json({ error: 'Missing html or deterministic result in request body.' });
    return;
  }

  try {
    const result = await runAiMigration(
      { html: body.html, ts: body.ts, deterministic: body.deterministic },
      { apiKey, deep: !!body.deep },
    );
    res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Migration failed';
    res.status(502).json({ error: message });
  }
}
