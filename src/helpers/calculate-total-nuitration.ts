import { Meal } from '@prisma/client';

import { Prisma } from '@prisma/client';

export type MealWithItems = Prisma.MealGetPayload<{
  include: {
    items: {
      include: {
        food: true;
      };
    };
  };
}>;

export function calculateTotalNutrition(meals: MealWithItems[]) {
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  for (const meal of meals) {
    for (const item of meal.items) {
      totals.calories += item.calories;
      totals.protein += item.protein;
      totals.carbs += item.carbs;
      totals.fat += item.fat;
    }
  }

  return totals;
}
