'use server';

import { requireAuth } from '@/lib/auth';
import { ExerciseService } from '@/services-server/exercise-service';
import { registerExerciseSchema, RegisterExericseDto, updateExerciseSchema } from '@/schemas/exercise-schema';

const exerciseService = new ExerciseService();

export async function registerExerciseAction(dto: RegisterExericseDto) {
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
export async function updateExerciseAction(id: number, dto: RegisterExericseDto) {
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
