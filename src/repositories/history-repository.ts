//Prisma
import { prisma } from '@/lib/prisma';

export class HistoryRepository {
  async getCompletedWorkoutSessions(userId: number, page: number) {
    const pageSize = 3;
    const skip = (page - 1) * pageSize;

    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId: userId,
        status: 'COMPLETED',
      },
      include: {
        workout: true,
        exercises: {
          include: {
            workoutExercise: {
              include: {
                exercise: true,
              },
            },
            sets: true,
          },
        },
      },
      orderBy: {
        finishedAt: 'desc',
      },
      skip,
      take: pageSize,
    });

    return sessions;
  }

  async getAllWorkoutSessionsCount(userId: number) {
    const sessionsCount = await prisma.workoutSession.count({
      where: {
        userId: userId,
      },
    });

    return sessionsCount;
  }

  async getTotalCompletedWorkout(userId: number) {
    const totalCompletedCount = await prisma.workoutSession.count({
      where: {
        userId: userId,
        status: 'COMPLETED',
      },
    });
    return totalCompletedCount;
  }

  async getTotalTrainingTime(userId: number) {
    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId,
        finishedAt: {
          not: null,
        },
      },
      select: {
        startedAt: true,
        finishedAt: true,
      },
    });

    let totalSeconds = 0;

    sessions.forEach((session) => {
      if (session.finishedAt) {
        const duration = session.finishedAt.getTime() - session.startedAt.getTime();

        totalSeconds += Math.floor(duration / 1000);
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours,
      minutes,
      seconds,
    };
  }

  async getTotalSets(userId: number) {
    const totalSets = await prisma.workoutSessionSet.count({
      where: {
        workoutSessionExercise: {
          workoutSession: {
            userId: userId,
            status: 'COMPLETED',
          },
        },
      },
    });

    return totalSets;
  }

  async getWorkoutSessions(userId: number) {
    const workoutSessions = await prisma.workoutSession.findMany({
      where: {
        userId: userId,
        status: 'COMPLETED',
      },
    });
    return workoutSessions;
  }
}
