import { verifyToken } from '@clerk/backend';

/**
 * Resolves the Clerk user ID from a request's `Authorization: Bearer <token>`
 * header, or `null` if there isn't one / it's invalid / Clerk isn't configured.
 *
 * Fails soft by design: callers that only use this to raise a signed-in
 * user's tier (see api/migrate-ai.ts) must keep working for anonymous
 * traffic even if Clerk is misconfigured. Callers that require auth to
 * function at all (save/list-migrations) check for `null` themselves and
 * respond 401.
 */
export async function getUserId(req: {
  headers: Record<string, string | string[] | undefined>;
}): Promise<string | null> {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) return null;

  const raw = req.headers['authorization'] ?? req.headers['Authorization'];
  const header = Array.isArray(raw) ? raw[0] : raw;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;

  try {
    const payload = await verifyToken(token, { secretKey });
    return payload.sub ?? null;
  } catch {
    return null;
  }
}
