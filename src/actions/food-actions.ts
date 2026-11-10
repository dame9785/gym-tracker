'use server';

import { requireAuth } from '@/lib/auth';
import { FoodService } from '@/services/food-service';

import { searchFoodSchema, foodBarcodeSchema, importExternalFoodSchema, importExternalFoodByIdSchema, deleteFoodSchema } from '@/schemas/food-schema';

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

/**
 * Find a food by barcode without importing it.
 */
export async function getFoodByBarcodeAction(barcode: string): Promise<FoodActionResult<Awaited<ReturnType<FoodServiceType['getFoodByBarcode']>>>> {
  const user = await requireAuth();

  try {
    const validation = foodBarcodeSchema.safeParse({ barcode });

    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const result = await foodService.getFoodByBarcode(user.userId, validation.data.barcode);

    if (!result) {
      return {
        success: false,
        message: 'Food product not found.',
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    console.error('Get food by barcode action failed:', error);

    return {
      success: false,
      message: 'Could not find food product. Please try again.',
    };
  }
}

/**
 * Import a product using its barcode.
 * Nutritional values are fetched server-side.
 */
export async function importFoodAction(barcode: string): Promise<FoodActionResult<Awaited<ReturnType<FoodServiceType['importFoodByBarcode']>>>> {
  const user = await requireAuth();

  try {
    const validation = importExternalFoodSchema.safeParse({ barcode });

    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const food = await foodService.importFoodByBarcode(user.userId, validation.data.barcode);

    return {
      success: true,
      message: 'Food imported successfully.',
      data: food,
    };
  } catch (error: unknown) {
    console.error('Import food action failed:', error);

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

export async function importExternalFoodByIdAction(source: 'OPEN_FOOD_FACTS' | 'LIVSMEDELSVERKET', externalId: string): Promise<FoodActionResult<Awaited<ReturnType<FoodServiceType['importExternalFoodById']>>>> {
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
