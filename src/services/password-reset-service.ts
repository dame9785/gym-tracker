import { createHash, randomBytes } from 'crypto';

import type { PasswordResetToken } from '@prisma/client';

import bcrypt from 'bcryptjs';

import { prisma } from '@/lib/prisma';

export class PasswordResetService {
  private readonly tokenExpirationMinutes = 30;
  private readonly maxRequests = 3;
  private readonly rateLimitMinutes = 15;

  /**
   * Hashes a password reset token using SHA-256.
   */
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generates a secure password reset token.
   */
  generateToken(): { token: string; tokenHash: string } {
    const token = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(token);

    return { token, tokenHash };
  }

  /**
   * Creates a password reset token for a user.
   * Existing unused tokens are invalidated.
   */
  async createToken(userId: number): Promise<string> {
    const { token, tokenHash } = this.generateToken();

    const expiresAt = new Date(Date.now() + this.tokenExpirationMinutes * 60 * 1000);

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
  async findValidToken(token: string): Promise<PasswordResetToken | null> {
    const tokenHash = this.hashToken(token);

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

  /**
   * Resets a user's password and invalidates outstanding reset tokens.
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = this.hashToken(token);

    await prisma.$transaction(async (tx) => {
      const resetToken = await tx.passwordResetToken.findUnique({
        where: {
          tokenHash,
        },
      });

      const now = new Date();

      if (!resetToken || resetToken.usedAt !== null || resetToken.expiresAt <= now) {
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
        where: {
          id: resetToken.userId,
        },
        data: {
          passwordHash,
          tokenVersion: {
            increment: 1,
          },
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

  /**
   * Checks whether a user can request another password reset.
   */
  async canRequestPasswordReset(userId: number): Promise<boolean> {
    const fifteenMinutesAgo = new Date(Date.now() - this.rateLimitMinutes * 60 * 1000);

    const requestCount = await prisma.passwordResetToken.count({
      where: {
        userId,
        createdAt: {
          gte: fifteenMinutesAgo,
        },
      },
    });

    return requestCount < this.maxRequests;
  }
}
