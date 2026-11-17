import { prisma } from '@/lib/prisma';

// --------------------------------------------------
// DTOs
// --------------------------------------------------

type UpdateGoalDto = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

// --------------------------------------------------
// Repository
// --------------------------------------------------

export class GoalRepository {
  // --------------------------------------------------
  // Get goal by user ID
  // --------------------------------------------------

  async getByUserId(userId: number) {
    return prisma.goal.findUnique({
      where: {
        userId,
      },
    });
  }

  // --------------------------------------------------
  // Create or update goal
  // --------------------------------------------------

  async upsert(userId: number, dto: UpdateGoalDto) {
    return prisma.goal.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        ...dto,
      },
      update: {
        ...dto,
      },
    });
  }
}
