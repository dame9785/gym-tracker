import { NextRequest } from 'next/server';

import { verifyToken } from '@/lib/jwt';

export function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}