import jwt, { type JwtPayload } from 'jsonwebtoken';

// --------------------------------------------------
// Types
// --------------------------------------------------

interface TokenPayload extends JwtPayload {
  userId: number;
  tokenVersion: number;
}

// --------------------------------------------------
// JWT configuration
// --------------------------------------------------

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured and contain at least 32 characters.');
  }

  return secret;
}

// --------------------------------------------------
// Generate token
// --------------------------------------------------

export function generateToken(userId: number, tokenVersion: number): string {
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new Error('Invalid user ID.');
  }

  if (!Number.isSafeInteger(tokenVersion) || tokenVersion < 0) {
    throw new Error('Invalid token version.');
  }

  return jwt.sign({ userId, tokenVersion }, getJwtSecret(), {
    algorithm: 'HS256',
    expiresIn: '7d',
  });
}

// --------------------------------------------------
// Verify token
// --------------------------------------------------

export function verifyToken(token: string): TokenPayload {
  const payload = jwt.verify(token, getJwtSecret(), {
    algorithms: ['HS256'],
    complete: false,
  });

  if (typeof payload !== 'object' || payload === null || typeof payload.exp !== 'number' || !Number.isSafeInteger(payload.userId) || payload.userId <= 0 || !Number.isSafeInteger(payload.tokenVersion) || payload.tokenVersion < 0) {
    throw new Error('Invalid token payload.');
  }

  return payload as TokenPayload;
}
