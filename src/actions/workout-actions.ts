'use server';

import { requireAuth } from '@/lib/auth';
import { registerWorkoutSchema, updateWorkoutSchema } from '@/schemas/workout-schemas';
import type { AddWorkoutDto, UpdateWorkoutDto } from '@/schemas/workout-schemas';
import { WorkoutService } from '@/services-server/workout-service';
import type { DeleteWorkoutActionResult, RegisterWorkoutActionResult, UpdateWorkoutActionResult } from '@/types/workout-types';

const workoutService = new WorkoutService();

export async function registerWorkoutAction(dto: AddWorkoutDto): Promise<RegisterWorkoutActionResult> {
  try {
    const user = await requireAuth();
    const validation = registerWorkoutSchema.safeParse(dto);

    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const workout = await workoutService.create(validation.data, user.userId);

    return {
      success: true,
      message: 'Workout created successfully.',
      data: workout,
    };
  } catch (error) {
    console.error('Register workout action failed:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}

export async function updateWorkoutAction(workoutId: number, dto: UpdateWorkoutDto): Promise<UpdateWorkoutActionResult> {
  try {
    const user = await requireAuth();

    if (!Number.isSafeInteger(workoutId) || workoutId <= 0) {
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

    const workout = await workoutService.update(workoutId, validation.data, user.userId);

    return {
      success: true,
      message: 'Workout updated successfully.',
      data: workout,
    };
  } catch (error) {
    console.error('Update workout action failed:', error);

    return {
      success: false,
      message: error instanceof Error && error.message === 'Could not find workout.' ? error.message : 'Something went wrong. Please try again.',
    };
  }
}

export async function deleteWorkoutAction(id: number): Promise<DeleteWorkoutActionResult> {
  try {
    const user = await requireAuth();

    if (!Number.isSafeInteger(id) || id <= 0) {
      return {
        success: false,
        message: 'Invalid workout ID.',
      };
    }

    await workoutService.delete(id, user.userId);

    return {
      success: true,
      message: 'Workout deleted successfully.',
    };
  } catch (error) {
    console.error('Delete workout action failed:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
