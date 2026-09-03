'use server';

import { requireAuth } from '@/lib/auth';
import { AddMealDto, addMealSchema } from '@/schemas/meal-schemas';
import { MealService } from '@/services-server/meal-service';

const mealService = new MealService();
export async function createMealAction(dto: AddMealDto) {
  const user = await requireAuth();

  const validation = addMealSchema.safeParse(dto);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  return mealService.addFoodToMeal(validation.data, user.userId);
}

export async function deleteMealItemAction(mealItemId: number) {
  const user = await requireAuth();
  try {
    return mealService.deleteMealItem(mealItemId);
  } catch (error) {
    console.error('Delete meal item action failed:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
