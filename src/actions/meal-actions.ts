'use server';

import { requireAuth } from '@/lib/auth';
import { MealService } from '@/services/meal-service';

import type { AppActionResult } from '@/types/action-types';

import { isValidId } from '@/utils/validation';
import { getActionErrorMessage, getActionValidationErrors } from '@/utils/action-error';

import { addCustomFoodSchema, addProductSchema, dateSchema, updateQuantitySchema } from '@/schemas/meal-schema';
import { MealMapping } from '@/mapping/meal-mapping';
import type { MealViewModel } from '@/mapping/meal-mapping';
import z from 'zod';

const mealService = new MealService();

// --------------------------------------------------
// Get meals by date
// --------------------------------------------------

export async function getMealsByDateAction(date: string): Promise<AppActionResult<MealViewModel[]>> {
  const user = await requireAuth();

  const validation = dateSchema.safeParse(date);

  if (!validation.success) {
    return {
      success: false,
      message: 'Invalid date.',
      errors: {
        date: validation.error.issues.map((issue) => issue.message),
      },
    };
  }

  try {
    const normalizedDate = new Date(`${validation.data}T00:00:00.000Z`);

    const meals = await mealService.getMealsByDate(user.userId, normalizedDate);

    return {
      success: true,
      data: meals.map(MealMapping.mapMeal),
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

// --------------------------------------------------
// Get meals by date range
// --------------------------------------------------

export async function getMealsByDateRangeAction(startDate: string, endDate: string): Promise<AppActionResult<MealViewModel[]>> {
  const user = await requireAuth();

  const validation = z
    .object({
      startDate: dateSchema,
      endDate: dateSchema,
    })
    .safeParse({ startDate, endDate });

  if (!validation.success) {
    return {
      success: false,
      message: 'Invalid date range.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const meals = await mealService.getMealsByDateRange(user.userId, new Date(`${validation.data.startDate}T00:00:00.000Z`), new Date(`${validation.data.endDate}T00:00:00.000Z`));

    return {
      success: true,
      data: meals.map(MealMapping.mapMeal),
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

// --------------------------------------------------
// Get meal by ID
// --------------------------------------------------

export async function getMealByIdAction(id: number): Promise<AppActionResult<MealViewModel>> {
  const user = await requireAuth();

  if (!isValidId(id)) {
    return {
      success: false,
      message: 'Invalid meal ID.',
    };
  }

  try {
    const meal = await mealService.getById(id, user.userId);

    if (!meal) {
      return {
        success: false,
        message: 'Meal not found.',
      };
    }

    return {
      success: true,
      data: MealMapping.mapMeal(meal),
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

// --------------------------------------------------
// Add product to meal
// --------------------------------------------------

export async function addProductToMealAction(input: unknown): Promise<AppActionResult<MealViewModel>> {
  const user = await requireAuth();

  const validation = addProductSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const meal = await mealService.addProductToMeal(user.userId, {
      ...validation.data,
      date: new Date(`${validation.data.date}T00:00:00.000Z`),
    });

    return {
      success: true,
      message: 'Food added to meal successfully.',
      data: MealMapping.mapMeal(meal),
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

// --------------------------------------------------
// Add custom food to meal
// --------------------------------------------------

export async function addCustomFoodToMealAction(input: unknown): Promise<AppActionResult<MealViewModel>> {
  const user = await requireAuth();

  const validation = addCustomFoodSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const meal = await mealService.addCustomFoodToMeal(user.userId, {
      ...validation.data,
      date: new Date(`${validation.data.date}T00:00:00.000Z`),
    });

    return {
      success: true,
      message: 'Custom food added to meal successfully.',
      data: MealMapping.mapMeal(meal),
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

// --------------------------------------------------
// Update meal item quantity
// --------------------------------------------------

export async function updateMealItemQuantityAction(input: unknown): Promise<AppActionResult<MealViewModel>> {
  const user = await requireAuth();

  const validation = updateQuantitySchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const meal = await mealService.updateMealItemQuantity(validation.data.mealItemId, user.userId, validation.data.quantity);

    return {
      success: true,
      message: 'Meal item updated successfully.',
      data: MealMapping.mapMeal(meal),
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

// --------------------------------------------------
// Remove meal item
// --------------------------------------------------

export async function removeMealItemAction(mealItemId: number): Promise<AppActionResult<MealViewModel>> {
  const user = await requireAuth();

  if (!isValidId(mealItemId)) {
    return {
      success: false,
      message: 'Invalid meal item ID.',
    };
  }

  try {
    const meal = await mealService.removeMealItem(mealItemId, user.userId);

    return {
      success: true,
      message: 'Meal item removed successfully.',
      data: MealMapping.mapMeal(meal),
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

// --------------------------------------------------
// Delete empty meal
// --------------------------------------------------

export async function deleteEmptyMealAction(mealId: number): Promise<AppActionResult> {
  const user = await requireAuth();

  if (!isValidId(mealId)) {
    return {
      success: false,
      message: 'Invalid meal ID.',
    };
  }

  try {
    await mealService.deleteEmptyMeal(mealId, user.userId);

    return {
      success: true,
      message: 'Meal deleted successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}
