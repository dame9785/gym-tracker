import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

// --------------------------------------------------
// Token validation
// --------------------------------------------------

export function getUserFromToken(token: string) {
  if (!token) {
    return null;
  }

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

// --------------------------------------------------
// Cookie handling
// --------------------------------------------------

export async function getTokenFromCookieStore(): Promise<string | undefined> {
  const cookieStore = await cookies();

  return cookieStore.get('token')?.value;
}

// --------------------------------------------------
// Authenticated user
// --------------------------------------------------

export async function getAuthenticatedUser() {
  const token = await getTokenFromCookieStore();

  if (!token) {
    return null;
  }

  const user = getUserFromToken(token);

  if (!user) {
    return null;
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    select: {
      tokenVersion: true,
    },
  });

  if (!dbUser || dbUser.tokenVersion !== user.tokenVersion) {
    return null;
  }

  return user;
}

// --------------------------------------------------
// Require authentication
// --------------------------------------------------

export async function requireAuth() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect('/account/login');
  }

  return user;
}
