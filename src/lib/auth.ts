import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

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

export async function getUserFromToken(token: string) {
  if (!token) {
    return false;
  }
  const payLoad = verifyToken(token);
  if (!payLoad) {
    return false;
  }

  return payLoad;
}

export async function getTokenFromCookieStore(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  return token;
}
