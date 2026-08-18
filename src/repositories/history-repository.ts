//Prisma
import { prisma } from '@/lib/prisma';

export class HistoryRepository {
  async getCompletedWorkoutSessions() {
    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId: 15,
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

  async getWorkoutSummary() {
    const totalWorkouts = await prisma.workoutSchedule.count({
      where: {
        userId: 15,
      },
    });

    const completedWorkouts = await prisma.workoutSession.count({
      where: {
        userId: 15,
        status: 'COMPLETED',
      },
    });

    const remainingWorkouts = Math.max(totalWorkouts - completedWorkouts, 0);

    return {
      totalWorkouts,
      completedWorkouts,
      remainingWorkouts,
    };
  }
}
