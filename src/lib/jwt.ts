import jwt, { type JwtPayload } from 'jsonwebtoken';

interface TokenPayload extends JwtPayload {
  userId: number;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured and contain at least 32 characters.');
  }

  return secret;
}

export function generateToken(userId: number): string {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('Invalid user ID.');
  }

  return jwt.sign({ userId }, getJwtSecret(), {
    algorithm: 'HS256',
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): TokenPayload {
  const payload = jwt.verify(token, getJwtSecret(), {
    algorithms: ['HS256'],
  });

  if (typeof payload === 'string' || !Number.isInteger(payload.userId) || typeof payload.userId !== 'number' || payload.userId <= 0) {
    throw new Error('Invalid token payload.');
  }

  return payload as TokenPayload;
}
