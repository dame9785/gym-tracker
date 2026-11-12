'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/lib/auth';

import { registerWorkoutSchema, updateWorkoutSchema } from '@/schemas/workout-schemas';

import type { AddWorkoutDto, UpdateWorkoutDto } from '@/schemas/workout-schemas';

import { WorkoutService } from '@/services/workout-service';
import type { AppActionResult } from '@/types/action-types';
import type { WorkoutViewModel } from '@/types/workout-types';
import { getActionErrorMessage, getActionValidationErrors } from '@/utils/action-error';

import { isValidId } from '@/utils/validation';

const workoutService = new WorkoutService();

export async function registerWorkoutAction(dto: AddWorkoutDto): Promise<AppActionResult<WorkoutViewModel>> {
  const user = await requireAuth();

  const validation = registerWorkoutSchema.safeParse(dto);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const workout = await workoutService.create(validation.data, user.userId);

    revalidatePath('/workout');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Workout created successfully.',
      data: workout,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

export async function updateWorkoutAction(workoutId: number, dto: UpdateWorkoutDto): Promise<AppActionResult<WorkoutViewModel>> {
  const user = await requireAuth();

  if (!isValidId(workoutId)) {
    return {
      success: false,
      message: 'Invalid workout ID.',
    };
  }

  const validation = updateWorkoutSchema.safeParse(dto);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const workout = await workoutService.update(workoutId, validation.data, user.userId);

    revalidatePath('/workout');
    revalidatePath(`/workout/${workoutId}`);
    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Workout updated successfully.',
      data: workout,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

export async function deleteWorkoutAction(id: number): Promise<AppActionResult> {
  const user = await requireAuth();

  if (!isValidId(id)) {
    return {
      success: false,
      message: 'Invalid workout ID.',
    };
  }

  try {
    await workoutService.delete(id, user.userId);

    revalidatePath('/workout');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Workout deleted successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}
