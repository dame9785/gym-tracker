import jwt, { type JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

interface TokenPayload extends JwtPayload {
  userId: number;
}

export function generateToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): TokenPayload {
  const payload = jwt.verify(token, JWT_SECRET);

  if (typeof payload === 'string' || typeof payload.userId !== 'number') {
    throw new Error('Ogiltig token.');
  }

  return payload as TokenPayload;
}