'use server';

import { requireAuth } from '@/lib/auth';
import { AddFoodDto, addFoodSchema, UpdateFoodDto } from '@/schemas/food-schemas';
import { FoodService } from '@/services-server/food-service';

const foodService = new FoodService();

export async function createFoodAction(dto: AddFoodDto) {
  const user = await requireAuth();

  const validation = addFoodSchema.safeParse(dto);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  return foodService.create(validation.data, user.userId);
}

export async function updateFoodAction(dto: UpdateFoodDto, foodId: number) {
  const user = await requireAuth();

  const validation = addFoodSchema.safeParse(dto);
  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  return foodService.update(validation.data, foodId, user.userId);
}

export async function deleteFoodAction(id: number) {
  try {
    const user = await requireAuth();

    return await foodService.delete(id, user.userId);
  } catch (error) {
    console.error('Delete exercise action failed:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
