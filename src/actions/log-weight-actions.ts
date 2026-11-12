'use server';

import { requireAuth } from '@/lib/auth';
import { WeightLogService } from '@/services/weight-log-service';

import { addWeightSchema, updateWeightSchema } from '@/schemas/weight-log.schemas';

import type { AddWeightDto, UpdateWeightDto } from '@/schemas/weight-log.schemas';

import type { AppActionResult } from '@/types/action-types';
import type { LogItemViewModel } from '@/types/log-weight-types';
import { getActionErrorMessage, getActionValidationErrors } from '@/utils/action-error';

import { isValidId } from '@/utils/validation';

const weightLogService = new WeightLogService();

export async function deleteLogWeight(id: number): Promise<AppActionResult> {
  const user = await requireAuth();

  if (!isValidId(id)) {
    return {
      success: false,
      message: 'Invalid weight log ID.',
    };
  }

  try {
    const result = await weightLogService.delete(id, user.userId);

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

export async function CreateWeightLogAction(dto: AddWeightDto): Promise<AppActionResult<LogItemViewModel>> {
  const user = await requireAuth();

  const validation = addWeightSchema.safeParse(dto);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    return await weightLogService.create(validation.data, user.userId);
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

export async function updateLogWeightAction(id: number, dto: UpdateWeightDto): Promise<AppActionResult<LogItemViewModel>> {
  const user = await requireAuth();

  if (!isValidId(id)) {
    return {
      success: false,
      message: 'Invalid weight log ID.',
    };
  }

  const validation = updateWeightSchema.safeParse(dto);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    return await weightLogService.update(id, validation.data, user.userId);
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}
