import { Redis } from '@upstash/redis';
import { put } from '@vercel/blob';
import { getUserId } from '../lib/auth/verify.js';

/**
 * POST /api/save-migration
 * Body: { tool, summary, payload? (cost-report/migrate-ai), artifactBase64? (migrate-project/own-library) }
 * Requires a signed-in user (Authorization: Bearer <Clerk token>) — unlike
 * migrate-ai.ts's soft-fail auth check, this endpoint has no function without
 * a user, so a missing/invalid token is a hard 401.
 *
 * Migrate Project / Own Library build their zips entirely client-side and
 * never send input files to the server (see their "runs 100% in your
 * browser" copy) — saving only ever uploads the already-computed output the
 * user explicitly opted to save, never their source project.
 */

const TOOLS = new Set(['cost-report', 'migrate-ai', 'migrate-project', 'own-library']);
const MAX_HISTORY = 50;
const MAX_ARTIFACT_BYTES = 4 * 1024 * 1024; // ~Vercel Functions body-size ceiling

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
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

  if (!process.env.CLERK_SECRET_KEY) {
    res.status(500).json({ error: 'Server is not configured (missing CLERK_SECRET_KEY).' });
    return;
  }

  const userId = await getUserId(req);
  if (!userId) {
    res.status(401).json({ error: 'Sign in to save migrations.' });
    return;
  }

  const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as {
    tool?: string;
    summary?: Record<string, string | number>;
    payload?: unknown;
    artifactBase64?: string;
  };

  if (!body?.tool || !TOOLS.has(body.tool)) {
    res.status(400).json({ error: 'Missing or unrecognized tool.' });
    return;
  }

  const entry: {
    id: string;
    tool: string;
    createdAt: string;
    summary: Record<string, string | number>;
    payload?: unknown;
    blobUrl?: string;
  } = {
    id: crypto.randomUUID(),
    tool: body.tool,
    createdAt: new Date().toISOString(),
    summary: body.summary ?? {},
  };

  if (body.artifactBase64) {
    const decoded = Buffer.from(body.artifactBase64, 'base64');
    if (decoded.byteLength > MAX_ARTIFACT_BYTES) {
      res.status(413).json({
        error: "Saving isn't supported for projects this large yet — download still works.",
      });
      return;
    }
    const blob = await put(`history/${userId}/${entry.id}.zip`, decoded, {
      access: 'public',
      contentType: 'application/zip',
    });
    entry.blobUrl = blob.url;
  } else if (body.payload !== undefined) {
    entry.payload = body.payload;
  }

  const key = `history:${userId}`;
  await redis.lpush(key, JSON.stringify(entry));
  await redis.ltrim(key, 0, MAX_HISTORY - 1);

  res.status(200).json({ ok: true, id: entry.id });
}
