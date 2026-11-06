import { createHash, randomBytes } from 'crypto';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export class PasswordResetService {
  /**
   * Generates a secure password reset token.
   */
  generateToken(): { token: string; tokenHash: string } {
    const token = randomBytes(32).toString('hex');

    const tokenHash = createHash('sha256').update(token).digest('hex');

    return { token, tokenHash };
  }

  /**
   * Creates a password reset token for a user.
   * Existing unused tokens are invalidated.
   */
  async createToken(userId: number): Promise<string> {
    const { token, tokenHash } = this.generateToken();

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.$transaction([
      prisma.passwordResetToken.updateMany({
        where: {
          userId,
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      }),

      prisma.passwordResetToken.create({
        data: {
          userId,
          tokenHash,
          expiresAt,
        },
      }),
    ]);

    return token;
  }

  /**
   * Finds a valid password reset token.
   */
  async findValidToken(token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    return prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    await prisma.$transaction(async (tx) => {
      const resetToken = await tx.passwordResetToken.findUnique({
        where: {
          tokenHash,
        },
      });

      if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date()) {
        throw new Error('Invalid or expired password reset link.');
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);

      const result = await tx.passwordResetToken.updateMany({
        where: {
          id: resetToken.id,
          usedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
        data: {
          usedAt: new Date(),
        },
      });

      if (result.count !== 1) {
        throw new Error('Invalid or expired password reset link.');
      }

      await tx.user.update({
        where: { id: resetToken.userId },
        data: {
          passwordHash,
          tokenVersion: { increment: 1 },
        },
      });

      // Invalidate all other outstanding reset tokens for this user.
      await tx.passwordResetToken.updateMany({
        where: {
          userId: resetToken.userId,
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      });
    });
  }
}
