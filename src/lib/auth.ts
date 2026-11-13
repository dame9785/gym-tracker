import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

// --------------------------------------------------
// Token validation
// --------------------------------------------------

function getUserFromToken(token: string) {
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

async function getTokenFromCookieStore(): Promise<string | undefined> {
  const cookieStore = await cookies();

  return cookieStore.get('token')?.value;
}

// --------------------------------------------------
// Authenticated user
// --------------------------------------------------

async function getAuthenticatedUser() {
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
      role: true,
    },
  });

  if (!dbUser || dbUser.tokenVersion !== user.tokenVersion) {
    return null;
  }

  return {
    ...user,
    role: dbUser.role,
  };
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

// --------------------------------------------------
// Require admin
// --------------------------------------------------

export async function requireAdmin() {
  const user = await requireAuth();

  if (user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return user;
}
