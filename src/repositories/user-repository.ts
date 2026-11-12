import type { Prisma, User } from '@prisma/client';

import { prisma } from '@/lib/prisma';

// --------------------------------------------------
// Prisma result types
// --------------------------------------------------

type UserCredentials = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    passwordHash: true;
    tokenVersion: true;
  };
}>;

// --------------------------------------------------
// Repository
// --------------------------------------------------

export class UserRepository {
  async findByEmail(email: string): Promise<UserCredentials | null> {
    return prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        tokenVersion: true,
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async emailExists(email: string, ignoreUserId?: number): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        email,
        NOT: ignoreUserId ? { id: ignoreUserId } : undefined,
      },
      select: {
        id: true,
      },
    });

    return user !== null;
  }

  async usernameExists(username: string, ignoreUserId?: number): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        username,
        NOT: ignoreUserId ? { id: ignoreUserId } : undefined,
      },
      select: {
        id: true,
      },
    });

    return user !== null;
  }

  async phoneNumberExists(phoneNumber: string, ignoreUserId?: number): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        phoneNumber,
        NOT: ignoreUserId ? { id: ignoreUserId } : undefined,
      },
      select: {
        id: true,
      },
    });

    return user !== null;
  }
}
