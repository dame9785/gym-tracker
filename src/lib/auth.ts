import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export function getUserFromToken(token: string) {
  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function getTokenFromCookieStore(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function requireAuth() {
  const token = await getTokenFromCookieStore();

  if (!token) {
    redirect('/account/login');
  }

  const user = getUserFromToken(token);

  if (!user) {
    redirect('/account/login');
  }

  return user;
}
