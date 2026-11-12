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
// Authentication
// --------------------------------------------------

export async function requireAuth() {
  const token = await getTokenFromCookieStore();

  if (!token) {
    redirect('/account/login');
  }

  const user = getUserFromToken(token);

  if (!user) {
    redirect('/account/login');
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
    redirect('/account/login');
  }

  return user;
}
