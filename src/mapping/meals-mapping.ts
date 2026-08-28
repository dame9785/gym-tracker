import { MealViewModel, MealItemViewModel } from '@/types/meal-types';
import { Meal, MealItem } from '@prisma/client';

import { Prisma } from '@prisma/client';
import { id } from 'zod/locales';

type MealWithItems = Prisma.MealGetPayload<{
  include: {
    items: {
      include: {
        food: true;
      };
    };
  };
}>;

export default class MealMapper {
  static toViewModel(meal: MealWithItems): MealViewModel {
    return {
      id: meal.id,
      userId: meal.userId,
      mealType: meal.mealType,
      createdAt: meal.createdAt.toISOString(),
      updatedAt: meal.updatedAt.toISOString(),
      items: meal.items.map(
        (item): MealItemViewModel => ({
          id: item.id,
          foodId: item.foodId,
          mealId: meal.id,
          grams: item.grams,

          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,

          food: {
            id: item.food.id,
            name: item.food.name,
            caloriesPer100g: item.food.caloriesPer100g,
            proteinPer100g: item.food.proteinPer100g,
            carbsPer100g: item.food.carbsPer100g,
            fatPer100g: item.food.fatPer100g,
          },
        }),
      ),
    };
  }
}
