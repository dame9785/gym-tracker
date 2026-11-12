'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/lib/auth';
import { WorkoutSessionService } from '@/services/workout-session-service';

import { createWorkoutSessionSchema, updateWorkoutSessionSetSchema, workoutSessionIdSchema, workoutSessionSetIdSchema } from '@/schemas/workout-session-schema';

import type { AppActionResult } from '@/types/action-types';
import { getActionErrorMessage, getActionValidationErrors } from '@/utils/action-error';

const workoutSessionService = new WorkoutSessionService();

export async function createWorkoutSessionAction(workoutId: number, workoutScheduleId?: number): Promise<AppActionResult<number>> {
  const user = await requireAuth();

  const validation = createWorkoutSessionSchema.safeParse({
    workoutId,
    workoutScheduleId,
  });

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const sessionId = await workoutSessionService.create(validation.data.workoutId, user.userId, validation.data.workoutScheduleId);

    return {
      success: true,
      message: 'Workout session created successfully.',
      data: sessionId,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

export async function updateWorkoutSessionSetAction(setId: number, dto: unknown): Promise<AppActionResult> {
  const user = await requireAuth();

  const idValidation = workoutSessionSetIdSchema.safeParse(setId);

  if (!idValidation.success) {
    return {
      success: false,
      message: 'Invalid set ID.',
    };
  }

  const validation = updateWorkoutSessionSetSchema.safeParse(dto);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    await workoutSessionService.updateSet(idValidation.data, validation.data.actualReps, validation.data.actualWeight, validation.data.actualSeconds, user.userId);

    return {
      success: true,
      message: 'Set saved successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

export async function finishWorkoutSessionAction(sessionId: number): Promise<AppActionResult> {
  const user = await requireAuth();

  const validation = workoutSessionIdSchema.safeParse(sessionId);

  if (!validation.success) {
    return {
      success: false,
      message: 'Invalid workout session ID.',
    };
  }

  try {
    await workoutSessionService.finish(validation.data, user.userId);

    revalidatePath('/dashboard');
    revalidatePath(`/workout-sessions/${sessionId}`);

    return {
      success: true,
      message: 'Workout completed successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

export async function setWorkoutSessionNotPerformedAction(sessionId: number): Promise<AppActionResult> {
  const user = await requireAuth();

  const validation = workoutSessionIdSchema.safeParse(sessionId);

  if (!validation.success) {
    return {
      success: false,
      message: 'Invalid workout session ID.',
    };
  }

  try {
    await workoutSessionService.updateWorkoutSessionStatus(validation.data, user.userId);

    revalidatePath('/dashboard');
    revalidatePath(`/workout-sessions/${sessionId}`);

    return {
      success: true,
      message: 'Workout status updated successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}
