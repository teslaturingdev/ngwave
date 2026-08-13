import { runAiMigration } from '../lib/ai/run.js';

/**
 * POST /api/migrate-ai
 * Body: { html: string, ts?: string, deterministic: {code, imports, report}, deep?: boolean }
 * Returns: { html, ts, changes, unresolved, model, corrected, usage }
 *
 * The deterministic codemod runs in the browser; this only does the AI "finish" step.
 * Key is server-side (ANTHROPIC_API_KEY env var) — never sent to the client.
 */

// Best-effort in-memory rate limit (per warm instance; resets on cold start). Real
// per-user limiting arrives with accounts + KV in Phase 2. Kept high for now so it
// doesn't block real use — the funded key's own credit is the true spend cap.
const DAILY_LIMIT = Number(process.env.MIGRATE_DAILY_LIMIT) || 100;
const hits = new Map<string, { count: number; day: string }>();

function ipOf(req: { headers: Record<string, string | string[] | undefined> }): string {
  const fwd = req.headers['x-forwarded-for'];
  const raw = Array.isArray(fwd) ? fwd[0] : fwd;
  return (raw || 'unknown').split(',')[0].trim();
}

function overLimit(ip: string): boolean {
  const day = new Date().toISOString().slice(0, 10);
  const rec = hits.get(ip);
  if (!rec || rec.day !== day) {
    hits.set(ip, { count: 1, day });
    return false;
  }
  rec.count += 1;
  return rec.count > DAILY_LIMIT;
}

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

  const ip = ipOf(req);
  if (overLimit(ip)) {
    res.status(429).json({
      error: `Free limit reached (${DAILY_LIMIT}/day). Sign-in tiers are coming soon.`,
    });
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
