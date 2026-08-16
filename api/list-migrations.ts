import { Redis } from '@upstash/redis';
import { getUserId } from '../lib/auth/verify.js';

/**
 * GET /api/list-migrations
 * Requires a signed-in user (Authorization: Bearer <Clerk token>) — 401 if missing/invalid.
 * Returns: { history: HistoryEntry[] }, newest-first.
 */

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export default async function handler(
  req: {
    method?: string;
    headers: Record<string, string | string[] | undefined>;
  },
  res: {
    status: (code: number) => { json: (body: unknown) => void };
  },
): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!process.env.CLERK_SECRET_KEY) {
    res.status(500).json({ error: 'Server is not configured (missing CLERK_SECRET_KEY).' });
    return;
  }

  const userId = await getUserId(req);
  if (!userId) {
    res.status(401).json({ error: 'Sign in to view your saved migrations.' });
    return;
  }

  const raw = await redis.lrange<string>(`history:${userId}`, 0, 49);
  const history = raw
    .map((item) => {
      try {
        return typeof item === 'string' ? JSON.parse(item) : item;
      } catch {
        return null;
      }
    })
    .filter((entry) => entry !== null);

  res.status(200).json({ history });
}
