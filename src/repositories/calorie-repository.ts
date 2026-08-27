import { getDateOnly } from '@/helpers/calorie-calculator';
import { prisma } from '@/lib/prisma';
import { CalorieGoal } from '@/types/calorie-types';

export class CalorieRepository {
  // Hämta användarens valda näringsmål
  async getCalorieGoal(userId: number) {
    return prisma.goal.findUnique({
      where: {
        userId,
      },
      select: {
        calorieGoal: true,
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
      },
    });
  }

  // Spara eller uppdatera dagens näringsintag
  async upsertNutritionLog(
    userId: number,
    data: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    },
  ) {
    const now = new Date();

    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const existingLog = await prisma.calorieLog.findFirst({
      where: {
        userId,
        loggedAt: {
          gte: startOfDay,
          lt: startOfTomorrow,
        },
      },
    });

    if (existingLog) {
      return prisma.calorieLog.update({
        where: {
          id: existingLog.id,
        },
        data: {
          calories: {
            increment: data.calories,
          },
          protein: {
            increment: data.protein,
          },
          carbs: {
            increment: data.carbs,
          },
          fat: {
            increment: data.fat,
          },
        },
      });
    }

    return prisma.calorieLog.create({
      data: {
        userId,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
      },
    });
  }

  async getCurrentNutritionStats(userId: number) {
    const startOfDay = getDateOnly();

    const startOfNextDay = new Date(startOfDay);
    startOfNextDay.setDate(startOfNextDay.getDate() + 1);

    return prisma.calorieLog.findFirst({
      where: {
        userId,
        loggedAt: {
          gte: startOfDay,
          lt: startOfNextDay,
        },
      },
      select: {
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
      },
    });
  }

  // Lägg till kalorier i dagens intag
  async addCalories(userId: number, calories: number) {
    const startOfDay = getDateOnly();

    const startOfNextDay = new Date(startOfDay);
    startOfNextDay.setDate(startOfNextDay.getDate() + 1);

    const existingLog = await prisma.calorieLog.findFirst({
      where: {
        userId,
        loggedAt: {
          gte: startOfDay,
          lt: startOfNextDay,
        },
      },
    });

    if (existingLog) {
      return prisma.calorieLog.update({
        where: {
          id: existingLog.id,
        },
        data: {
          calories: {
            increment: calories,
          },
        },
      });
    }

    return prisma.calorieLog.create({
      data: {
        userId,
        calories,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    });
  }

  // Spara eller uppdatera användarens näringsmål
  async updateNutritionGoal(
    userId: number,
    data: {
      calorieGoal: CalorieGoal;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    },
  ) {
    return prisma.goal.upsert({
      where: {
        userId,
      },
      update: {
        calorieGoal: data.calorieGoal,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
      },
      create: {
        userId,
        calorieGoal: data.calorieGoal,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
      },
    });
  }

  // Hämta dagens näringsintag
  async getTodayCalorieLog(userId: number) {
    const startOfDay = getDateOnly();

    const startOfNextDay = new Date(startOfDay);
    startOfNextDay.setDate(startOfNextDay.getDate() + 1);

    return prisma.calorieLog.findFirst({
      where: {
        userId,
        loggedAt: {
          gte: startOfDay,
          lt: startOfNextDay,
        },
      },
    });
  }

  // Hämta näringshistorik
  async getCalorieHistory(userId: number) {
    return prisma.calorieLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        loggedAt: 'desc',
      },
    });
  }
}
