import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import type { AddWeightDto, UpdateWeightDto } from '@/schemas/weight-log.schemas';

// --------------------------------------------------
// Prisma result types
// --------------------------------------------------

type WeightLog = Prisma.WeightLogGetPayload<Record<string, never>>;

// --------------------------------------------------
// Repository
// --------------------------------------------------

export class WeightLogRepository {
  async getAll(userId: number, page: number, pageSize: number): Promise<WeightLog[]> {
    const skip = (page - 1) * pageSize;

    return prisma.weightLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        loggedAt: 'desc',
      },
      skip,
      take: pageSize,
    });
  }

  async getTotalNumberOfLogs(userId: number): Promise<number> {
    return prisma.weightLog.count({
      where: {
        userId,
      },
    });
  }

  async firstLog(userId: number): Promise<WeightLog | null> {
    return prisma.weightLog.findFirst({
      where: {
        userId,
      },
      orderBy: {
        loggedAt: 'asc',
      },
    });
  }

  async delete(id: number, userId: number): Promise<WeightLog | null> {
    const weightLog = await prisma.weightLog.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!weightLog) {
      return null;
    }

    return prisma.weightLog.delete({
      where: {
        id: weightLog.id,
      },
    });
  }

  async lastLog(userId: number): Promise<WeightLog | null> {
    return prisma.weightLog.findFirst({
      where: {
        userId,
      },
      orderBy: {
        loggedAt: 'desc',
      },
    });
  }

  async create(dto: AddWeightDto, userId: number): Promise<WeightLog> {
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

  async update(logWeightId: number, userId: number, dto: UpdateWeightDto): Promise<WeightLog | null> {
    const weightLog = await prisma.weightLog.findFirst({
      where: {
        id: logWeightId,
        userId,
      },
    });

    if (!weightLog) {
      return null;
    }

    return prisma.weightLog.update({
      where: {
        id: weightLog.id,
      },
      data: {
        weight: dto.weight,
        note: dto.note,
      },
    });
  }

  async getById(id: number, userId: number): Promise<WeightLog | null> {
    return prisma.weightLog.findUnique({
      where: {
        id,
        userId,
      },
    });
  }
}
