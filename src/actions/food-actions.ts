'use server';

import { requireAuth } from '@/lib/auth';
import { FoodService } from '@/services/food-service';

import { searchFoodSchema, importExternalFoodByIdSchema, deleteFoodSchema } from '@/schemas/food-schema';

import type { FoodService as FoodServiceType } from '@/services/food-service';

const foodService = new FoodService();

export interface FoodActionError {
  success: false;
  message: string;
  errors?: Record<string, string[] | undefined>;
}

export interface FoodActionSuccess<T = undefined> {
  success: true;
  message?: string;
  data?: T;
}

export type FoodActionResult<T = undefined> = FoodActionSuccess<T> | FoodActionError;

/**
 * Search local and external foods.
 */
export async function searchFoodsAction(query: string): Promise<FoodActionResult<Awaited<ReturnType<FoodServiceType['searchFoods']>>>> {
  const user = await requireAuth();

  try {
    const validation = searchFoodSchema.safeParse({ query });

    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const result = await foodService.searchFoods(user.userId, validation.data.query);

    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    console.error('Search foods action failed:', error);

    return {
      success: false,
      message: 'Could not search foods. Please try again.',
    };
  }
}

export async function importExternalFoodByIdAction(source: 'LIVSMEDELSVERKET', externalId: string): Promise<FoodActionResult<Awaited<ReturnType<FoodServiceType['importExternalFoodById']>>>> {
  const user = await requireAuth();

  try {
    const validation = importExternalFoodByIdSchema.safeParse({
      source,
      externalId,
    });

    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const food = await foodService.importExternalFoodById(user.userId, validation.data.source, validation.data.externalId);

    return {
      success: true,
      message: 'Food imported successfully.',
      data: food,
    };
  } catch (error: unknown) {
    console.error('Import external food action failed:', error);

    if (error instanceof Error && error.message === 'Food product not found.') {
      return {
        success: false,
        message: 'Food product not found.',
      };
    }

    return {
      success: false,
      message: 'Could not import food. Please try again.',
    };
  }
}

/**
 * Delete a food from the user's food library.
 */
/**
 * Delete a food from the user's food library.
 */
export async function deleteFoodAction(foodId: number): Promise<FoodActionResult<boolean>> {
  const user = await requireAuth();

  try {
    const validation = deleteFoodSchema.safeParse({ foodId });

    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed.',
      };
    }

    const deleted = await foodService.deleteFood(user.userId, validation.data.foodId);

    if (!deleted) {
      return {
        success: false,
        message: 'Livsmedlet kunde inte hittas.',
      };
    }

    return {
      success: true,
      message: 'Livsmedlet har tagits bort.',
      data: true,
    };
  } catch (error: unknown) {
    console.error('Delete food action failed:', error);

    return {
      success: false,
      message: 'Kunde inte ta bort livsmedlet. Försök igen.',
    };
  }
}

/**
 * Get featured foods for the initial food search view.
 */
export async function getFeaturedFoodsAction(): Promise<FoodActionResult<Awaited<ReturnType<FoodServiceType['getFeaturedFoods']>>>> {
  const user = await requireAuth();

  try {
    const foods = await foodService.getFeaturedFoods(user.userId);

    return {
      success: true,
      data: foods,
    };
  } catch (error: unknown) {
    console.error('Get featured foods action failed:', error);

    return {
      success: false,
      message: 'Could not load featured foods. Please try again.',
    };
  }
}
