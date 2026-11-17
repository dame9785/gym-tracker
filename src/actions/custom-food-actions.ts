'use server';

import { requireAuth } from '@/lib/auth';
import { CustomFoodService } from '@/services/custom-food-service';

import { createCustomFoodSchema, updateCustomFoodSchema } from '@/schemas/custom-food-schema';

import type { AppActionResult } from '@/types/action-types';
import type { CustomFoodViewModel } from '@/types/foods-type';

import { FoodMappper } from '@/mapping/food-mapping';

import { isValidId } from '@/utils/validation';
import { getActionErrorMessage, getActionValidationErrors } from '@/utils/action-error';

const customFoodService = new CustomFoodService();

// --------------------------------------------------
// Get custom foods
// --------------------------------------------------

export async function getCustomFoodsAction(search?: string): Promise<AppActionResult<CustomFoodViewModel[]>> {
  const user = await requireAuth();

  try {
    const customFoods = await customFoodService.getAll(user.userId, search);

    return {
      success: true,
      data: customFoods.map(FoodMappper.mapCustomFood),
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
// Get custom food by ID
// --------------------------------------------------

export async function getCustomFoodByIdAction(id: number): Promise<AppActionResult<CustomFoodViewModel>> {
  const user = await requireAuth();

  if (!isValidId(id)) {
    return {
      success: false,
      message: 'Invalid custom food ID.',
    };
  }

  try {
    const customFood = await customFoodService.getById(id, user.userId);

    return {
      success: true,
      data: FoodMappper.mapCustomFood(customFood),
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
// Create custom food
// --------------------------------------------------

export async function createCustomFoodAction(input: unknown): Promise<AppActionResult<CustomFoodViewModel>> {
  const user = await requireAuth();

  const validation = createCustomFoodSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const customFood = await customFoodService.create(validation.data, user.userId);

    return {
      success: true,
      message: 'Custom food created successfully.',
      data: FoodMappper.mapCustomFood(customFood),
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
// Update custom food
// --------------------------------------------------

export async function updateCustomFoodAction(id: number, input: unknown): Promise<AppActionResult<CustomFoodViewModel>> {
  const user = await requireAuth();

  if (!isValidId(id)) {
    return {
      success: false,
      message: 'Invalid custom food ID.',
    };
  }

  const validation = updateCustomFoodSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const customFood = await customFoodService.update(id, validation.data, user.userId);

    return {
      success: true,
      message: 'Custom food updated successfully.',
      data: FoodMappper.mapCustomFood(customFood),
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
// Delete custom food
// --------------------------------------------------

export async function deleteCustomFoodAction(id: number): Promise<AppActionResult> {
  const user = await requireAuth();

  if (!isValidId(id)) {
    return {
      success: false,
      message: 'Invalid custom food ID.',
    };
  }

  try {
    await customFoodService.delete(id, user.userId);

    return {
      success: true,
      message: 'Custom food deleted successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}
