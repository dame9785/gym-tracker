//Prisma
import { prisma } from '@/lib/prisma';

export class ProgressRepository {
  async getWeightProgress(userId: number) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        goalWeight: true,
        weightLogs: {
          orderBy: {
            loggedAt: 'asc',
          },
          take: 1,
          select: {
            weight: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const latestWeightLog = await prisma.weightLog.findFirst({
      where: {
        userId,
      },
      orderBy: {
        loggedAt: 'desc',
      },
      select: {
        weight: true,
      },
    });

    return {
      startWeight: user.weightLogs.length > 0 ? Number(user.weightLogs[0].weight) : null,
      currentWeight: latestWeightLog ? Number(latestWeightLog.weight) : null,
      goalWeight: Number(user.goalWeight),
    };
  }
}
