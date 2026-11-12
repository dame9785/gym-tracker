'use server';

import { WeightLogService } from '@/services/weight-log-service';
import { requireAuth } from '@/lib/auth';

import { addWeightSchema, updateWeightSchema } from '@/schemas/weight-log.schemas';

import type { AddWeightDto, UpdateWeightDto } from '@/schemas/weight-log.schemas';

import type { AppActionResult } from '@/types/action-types';

const weightLogService = new WeightLogService();

export async function deleteLogWeight(id: number): Promise<AppActionResult> {
  try {
    const user = await requireAuth();

    const result = await weightLogService.delete(id, user.userId);

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error: unknown) {
    console.error('Delete weight log action failed:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}

export async function CreateWeightLogAction(dto: AddWeightDto): Promise<AppActionResult<unknown>> {
  try {
    const user = await requireAuth();
    const validation = addWeightSchema.safeParse(dto);

    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    return await weightLogService.create(validation.data, user.userId);
  } catch (error: unknown) {
    console.error('Create weight log action failed:', error);

    return {
      success: false,
      message: 'Could not create weight log. Please try again.',
    };
  }
}

export async function updateLogWeightAction(id: number, dto: UpdateWeightDto): Promise<AppActionResult<unknown>> {
  try {
    const user = await requireAuth();
    const validation = updateWeightSchema.safeParse(dto);

    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    return await weightLogService.update(id, validation.data, user.userId);
  } catch (error: unknown) {
    console.error('Update weight log action failed:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
