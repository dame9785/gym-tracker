import { prisma } from '../../src/lib/prisma';

export class UserRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findByUsername(username: string) {
    return await prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async create(data: { firstName?: string; lastName?: string; username: string; email: string; passwordHash: string }) {
    return await prisma.user.create({
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
}
