'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/lib/auth';
import { WorkoutSessionService } from '@/services/workout-session-service';

import { createWorkoutSessionSchema, updateWorkoutSessionSetSchema, workoutSessionIdSchema } from '@/schemas/workout-session-schema';

import type { AppActionResult } from '@/types/action-types';

const workoutSessionService = new WorkoutSessionService();

// Create workout session
export async function createWorkoutSessionAction(workoutId: number, workoutScheduleId?: number): Promise<AppActionResult<number>> {
  const user = await requireAuth();

  try {
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

    const sessionId = await workoutSessionService.create(validation.data.workoutId, user.userId, validation.data.workoutScheduleId);

    return {
      success: true,
      message: 'Workout session created successfully.',
      data: sessionId,
    };
  } catch (error: unknown) {
    console.error('Create workout session action failed:', error);

    const message = error instanceof Error && ['Workout hittades inte.', 'Workout innehåller inga övningar.'].includes(error.message) ? error.message : 'Could not start workout. Please try again.';

    return {
      success: false,
      message,
    };
  }
}

// Update workout session set
export async function updateWorkoutSessionSetAction(setId: number, dto: unknown): Promise<AppActionResult> {
  const user = await requireAuth();

  try {
    const idValidation = workoutSessionIdSchema.safeParse(setId);

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

    await workoutSessionService.updateSet(idValidation.data, validation.data.actualReps, validation.data.actualWeight, validation.data.actualSeconds, user.userId);

    return {
      success: true,
      message: 'Set saved successfully.',
    };
  } catch (error: unknown) {
    console.error('Update workout session set action failed:', error);

    return {
      success: false,
      message: 'Could not save set. Please try again.',
    };
  }
}

// Finish workout session
export async function finishWorkoutSessionAction(sessionId: number): Promise<AppActionResult> {
  const user = await requireAuth();

  try {
    const validation = workoutSessionIdSchema.safeParse(sessionId);

    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid workout session ID.',
      };
    }

    await workoutSessionService.finish(validation.data, user.userId);

    revalidatePath('/dashboard');
    revalidatePath(`/workout-sessions/${sessionId}`);

    return {
      success: true,
      message: 'Workout completed successfully.',
    };
  } catch (error: unknown) {
    console.error('Finish workout session action failed:', error);

    return {
      success: false,
      message: 'Could not finish workout. Please try again.',
    };
  }
}

// Set workout session to not performed
export async function setWorkoutSessionNotPerformedAction(sessionId: number): Promise<AppActionResult> {
  const user = await requireAuth();

  try {
    const validation = workoutSessionIdSchema.safeParse(sessionId);

    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid workout session ID.',
      };
    }

    await workoutSessionService.updateWorkoutSessionStatus(validation.data, user.userId);

    revalidatePath('/dashboard');
    revalidatePath(`/workout-sessions/${sessionId}`);

    return {
      success: true,
      message: 'Workout status updated successfully.',
    };
  } catch (error: unknown) {
    console.error('Set workout session status action failed:', error);

    return {
      success: false,
      message: 'Could not update workout. Please try again.',
    };
  }
}
