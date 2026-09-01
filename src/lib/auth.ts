import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);

  if (!payload) {
    return null;
  }

  return payload;
}

export function getUserFromToken(token: string) {
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);

  if (!payload) {
    return null;
  }

  return payload;
}

export async function getTokenFromCookieStore(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  return token;
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
