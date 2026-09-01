'use server';

import { requireAuth } from '@/lib/auth';
import { ExerciseService } from '@/services-server/exercise-service';
import { registerExerciseSchema, updateExerciseSchema } from '@/schemas/exercise-schema';
import type { RegisterExerciseDto } from '@/types/exercise-types';

const exerciseService = new ExerciseService();

export async function registerExerciseAction(dto: RegisterExerciseDto) {
  const user = await requireAuth();

  const validation = registerExerciseSchema.safeParse(dto);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  return exerciseService.registerExercise(validation.data, user.userId);
}

export async function deleteExerciseAction(id: number) {
  try {
    const user = await requireAuth();

    return await exerciseService.delete(id, user.userId);
  } catch (error) {
    console.error('Delete exercise action failed:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}

// UPDATE
export async function updateExerciseAction(id: number, dto: RegisterExerciseDto) {
  try {
    const user = await requireAuth();

    const validation = updateExerciseSchema.safeParse(dto);

    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    return await exerciseService.update(id, validation.data, user.userId);
  } catch (error) {
    console.error('Update exercise action failed:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
