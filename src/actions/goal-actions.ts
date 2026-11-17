'use server';

import { requireAuth } from '@/lib/auth';
import { GoalService } from '@/services/goal-service';

import type { AppActionResult } from '@/types/action-types';

import { getActionErrorMessage, getActionValidationErrors } from '@/utils/action-error';

// --------------------------------------------------
// Service
// --------------------------------------------------

const goalService = new GoalService();

// --------------------------------------------------
// Calculate and save nutrition goals
// --------------------------------------------------

export async function calculateAndSaveNutritionGoalsAction(): Promise<AppActionResult<Awaited<ReturnType<GoalService['calculateAndSave']>>>> {
  const user = await requireAuth();

  try {
    const result = await goalService.calculateAndSave(user.userId);

    return {
      success: true,
      message: 'Nutrition goals calculated successfully.',
      data: result,
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
// Get nutrition goals
// --------------------------------------------------

export async function getNutritionGoalsAction(): Promise<AppActionResult<Awaited<ReturnType<GoalService['getByUserId']>>>> {
  const user = await requireAuth();

  try {
    const goal = await goalService.getByUserId(user.userId);

    return {
      success: true,
      data: goal,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}
