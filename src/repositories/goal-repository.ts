import { prisma } from '@/lib/prisma';
import { GoalTypeViewModel } from '@/types/goal-types';

export class GoalRepository {
  async getAllGoals(): Promise<GoalTypeViewModel[]> {
    return prisma.goalType.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }
}
