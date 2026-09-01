//Prisma
import { prisma } from '@/lib/prisma';
import { AddWeightDto, UpdateWeightDto } from '@/schemas/weight-log.schemas';

export class WeightLogRepository {
  async getAll(userId: number, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    return prisma.weightLog.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        loggedAt: 'desc',
      },
      skip,
      take: pageSize,
    });
  }

  async getTotalNumberOfLogs(userId: number) {
    return prisma.weightLog.count({
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

  async delete(id: number, userId: number) {
    const weightLog = await prisma.weightLog.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!weightLog) {
      return null;
    }

    return await prisma.weightLog.delete({
      where: {
        id: weightLog.id,
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

  async create(dto: AddWeightDto, userId: number) {
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

  async update(logWeightId: number, userId: number, dto: UpdateWeightDto) {
    const weightLog = prisma.weightLog.findFirst({
      where: {
        logWeightId,
        userId,
      },
    });

    if (!weightLog) {
      return null;
    }

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

  async getById(id: number, userId: number) {
    return await prisma.weightLog.findUnique({
      where: {
        id: id,
        userId,
      },
    });
  }
}
