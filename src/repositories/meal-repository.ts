import { Meal, MealType, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ApiResponse, ApiSuccessResponse } from '@/types/api-types';

import MealMapper from '@/mapping/meals-mapping';
import { MealsApiResponse } from '@/types/meal-types';

type CreateMealData = {
  userId: number;
  name: string;
  mealType: MealType;
  items: {
    foodId: number;
    grams: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
};
export type MealWithItemsAndFood = Prisma.MealGetPayload<{
  include: {
    items: {
      include: {
        food: true;
      };
    };
  };
}>;

export class MealRepository {
  async create(data: CreateMealData) {
    return prisma.meal.create({
      data: {
        userId: data.userId,
        name: data.name,
        mealType: data.mealType,

        items: {
          create: data.items.map((item) => ({
            foodId: item.foodId,
            grams: item.grams,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
          })),
        },
      },

      include: {
        items: {
          include: {
            food: true,
          },
        },
      },
    });
  }

  async createMealItem(
    mealId: number,
    foodId: number,
    data: {
      grams: number;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    },
  ) {
    return prisma.mealItem.create({
      data: {
        mealId,
        foodId,
        ...data,
      },
      include: {
        food: true,
      },
    });
  }

  async getMeals(userId: number): Promise<MealWithItemsAndFood[]> {
    const now = new Date();

    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const meals = await prisma.meal.findMany({
      where: {
        userId,
        loggedAt: {
          gte: startOfDay,
          lt: startOfTomorrow,
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

    return meals;
  }
}
