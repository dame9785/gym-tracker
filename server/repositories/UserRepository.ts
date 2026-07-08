import { prisma } from '../../lib/prisma';
import { Gender } from '@prisma/client';
import { Goal } from '@prisma/client';
import { WorkoutDay } from '@prisma/client';
export class UserRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  //Register User
  async registerUser(data: {
    firstName?: string;
    lastName?: string;
    username: string;
    email: string;
    passwordHash: string;
    description?: string;
    bodyWeight?: number;
    height?: number;
    gender?: Gender;
    birthDate?: Date;
    createdAt: Date;
  }) {
    return await prisma.user.create({
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
