import { getTokenFromCookieStore, getUserFromToken } from '@/lib/auth';

// --------------------------------------------------
// Get current authenticated user
// --------------------------------------------------

export async function getCurrentUser(): Promise<{ userId: number } | null> {
  const token = await getTokenFromCookieStore();

  if (!token) {
    return null;
  }

  const payload = getUserFromToken(token);

  if (!payload) {
    return null;
  }

  return {
    userId: payload.userId,
  };
}
