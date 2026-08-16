//Prisma
import { prisma } from '@/lib/prisma';
import { EditWeightDto } from '@/schemas/auth-schemas';

//Types
import type { LogWeightDto } from '@/types/log-weight-types';

export class WeightLogRepository {
  async getAll(userId: number) {
    return prisma.weightLog.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async firstLog(userId: number) {
    return await prisma.weightLog.findFirst({
      where: {
        userId,
      },
      orderBy: {
        loggedAt: 'asc',
      },
    });
  }

  async delete(id: number) {
    return await prisma.weightLog.delete({
      where: {
        id,
      },
    });
  }

  async lastLog(userId: number) {
    return await prisma.weightLog.findFirst({
      where: {
        userId,
      },
      orderBy: {
        loggedAt: 'desc',
      },
    });
  }

  async create(userId: number, dto: LogWeightDto) {
    return prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          bodyWeight: dto.weight,
        },
      });

      return tx.weightLog.create({
        data: {
          userId,
          weight: dto.weight,
          note: dto.note,
        },
      });
    });
  }

  async update(logWeightId: number, dto: EditWeightDto) {
    console.log('logWeightId:', logWeightId);
    return await prisma.weightLog.update({
      where: {
        id: logWeightId,
      },
      data: {
        weight: dto.weight,
        note: dto.note,
      },
    });
  }

  async getById(id: number) {
    return await prisma.weightLog.findUnique({
      where: {
        id: id,
      },
    });
  }
}
