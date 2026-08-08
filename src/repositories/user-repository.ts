//Prisma
import { Prisma, User } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });
  }

  //Register User
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  //Fins User by UserName
  async findByUsername(username: string) {
    return await prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  //Update User
  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async findById(id: number) {
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
}
