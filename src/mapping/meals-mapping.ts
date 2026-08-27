import { Prisma } from '@prisma/client';

import { MealItemViewModel, MealViewModel } from '@/types/meal-types';

type MealWithItemsAndFood = Prisma.MealGetPayload<{
  include: {
    items: {
      include: {
        food: true;
      };
    };
  };
}>;

export default class MealMapper {
  static mapMealDboToViewModel(meal: MealWithItemsAndFood): MealViewModel {
    const mealItems: MealItemViewModel[] = meal.items.map((item) => ({
      id: item.id,
      foodId: item.foodId,
      foodName: item.food.name,
      grams: item.grams,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
    }));

    return {
      id: meal.id,
      name: meal.name,
      mealType: meal.mealType,
      loggedAt: meal.loggedAt,
      items: mealItems,
    };
  }
}
