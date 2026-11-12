import { cookies } from 'next/headers';

// --------------------------------------------------
// Cookie configuration
// --------------------------------------------------

const AUTH_COOKIE_NAME = 'token';

const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};

// --------------------------------------------------
// Set authentication cookie
// --------------------------------------------------

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);
}

// --------------------------------------------------
// Clear authentication cookie
// --------------------------------------------------

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_COOKIE_NAME);
}
