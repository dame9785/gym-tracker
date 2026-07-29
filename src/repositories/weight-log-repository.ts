import { prisma } from '@/lib/prisma';
import type { LogWeightDto } from '@/dto/log-weight-dto';

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
}
