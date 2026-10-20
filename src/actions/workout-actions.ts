'use server';

import { requireAuth } from '@/lib/auth';
import { AddWorkoutDto, registerWorkoutSchema, UpdateWorkoutDto, updateWorkoutSchema } from '@/schemas/workout-schemas';
import { WorkoutService } from '@/services-server/workout-service';
import { UpdateWorkoutActionResult } from '@/types/workout-types';

const workoutService = new WorkoutService();
export async function registerWorkoutAction(dto: AddWorkoutDto) {
  const user = await requireAuth();

  const validation = registerWorkoutSchema.safeParse(dto);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  return workoutService.create(validation.data, user.userId);
}

export async function updateWorkoutAction(workoutId: number, dto: UpdateWorkoutDto): Promise<UpdateWorkoutActionResult> {
  try {
    const user = await requireAuth();

    const validation = updateWorkoutSchema.safeParse(dto);

    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const result = await workoutService.update(workoutId, validation.data, user.userId);
    if (!result.success) {
      return {
        success: false,
        message: 'Something went wrong while updating workout',
      };
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.error('Update exercise action failed:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}

export async function deleteWorkoutAction(id: number) {
  try {
    const user = await requireAuth();

    return await workoutService.delete(id, user.userId);
  } catch (error) {
    console.error('Delete exercise action failed:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
