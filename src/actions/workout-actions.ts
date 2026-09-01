'use server';

import { requireAuth } from '@/lib/auth';
import { AddWorkoutDto, registerWorkoutSchema, UpdateWorkoutDto, updateWorkoutSchema } from '@/schemas/workout-schemas';
import { WorkoutService } from '@/services-server/workout-service';

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

export async function updateWorkoutAction(workoutId: number, dto: UpdateWorkoutDto) {
  console.log('Upate acction');
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

    return await workoutService.update(workoutId, validation.data, user.userId);
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
