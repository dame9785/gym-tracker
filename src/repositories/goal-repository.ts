import { prisma } from '@/lib/prisma';
import { GoalTypeViewModel } from '@/types/goal-types';

export class GoalRepository {
  async getByUserId(userId: number) {
    return prisma.goal.findUnique({
      where: {
        userId,
      },
    });
  }
}
