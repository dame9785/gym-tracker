import { MealType } from '@prisma/client';
import { prisma } from '@/lib/prisma';

interface CreateMealItemData {
  mealId: number;
  foodId: number;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export class MealRepository {
  async findTodayMealByType(userId: number, mealType: MealType) {
    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.meal.findFirst({
      where: {
        userId,
        mealType,
        loggedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        items: true,
      },
    });
  }

  async createMeal(userId: number, mealType: MealType) {
    return prisma.meal.create({
      data: {
        userId,
        mealType,
        name: mealType,
      },
    });
  }

  async addItem(data: CreateMealItemData) {
    return prisma.mealItem.create({
      data,
      include: {
        food: true,
      },
    });
  }

  async getTodayMeals(userId: number) {
    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.meal.findMany({
      where: {
        userId,
        loggedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        items: {
          include: {
            food: true,
          },
        },
      },
      orderBy: {
        loggedAt: 'asc',
      },
    });
  }

  async getMealsByDate(userId: number, date: string) {
    const selectedDate = new Date(`${date}T00:00:00`);

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.meal.findMany({
      where: {
        userId,
        loggedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        items: {
          include: {
            food: true,
          },
        },
      },
      orderBy: {
        loggedAt: 'asc',
      },
    });
  }

  async deleteMeal(id: number) {
    return await prisma.meal.delete({
      where: {
        id: id,
      },
    });
  }
}
