//Types
import type { WorkoutValidationResult, WorkoutDto } from '@/types/workout-types';

/**
 * Validates a workout before it is created or updated.
 *
 * Ensures that:
 * - The workout name is provided.
 * - The workout description is provided.
 * - At least one exercise has been added.
 * - No duplicate exercises exist.
 * - Each exercise has a valid exercise, sets, reps, and weight.
 *
 * @param formData The workout data to validate.
 * @returns A validation result indicating whether the workout is valid.
 */
export function validateWorkoutHelper(formData: WorkoutDto): WorkoutValidationResult {
  if (formData.name.trim() === '') {
    return {
      message: 'Workout namn måste fyllas i.',
      success: false,
    };
  }

  if (formData.description.trim() === '') {
    return {
      message: 'Beskrivning måste fyllas i.',
      success: false,
    };
  }

  if (formData.workoutExercises.length === 0) {
    return {
      message: 'Du måste lägga till minst en övning.',
      success: false,
    };
  }

  const exerciseIds = new Set<number>();

  for (const exercise of formData.workoutExercises) {
    if (exercise.exerciseId === 0) {
      return {
        message: 'Du måste välja minst en övning',
        success: false,
      };
    }

    if (exerciseIds.has(exercise.exerciseId)) {
      return {
        message: 'Du kan inte välja samma övning flera gånger.',
        success: false,
      };
    }

    exerciseIds.add(exercise.exerciseId);

    if (exercise.sets < 1) {
      return {
        message: 'Set måste vara minst 1.',
        success: false,
      };
    }

    if (exercise.reps < 1) {
      return {
        message: 'Reps måste vara minst 1.',
        success: false,
      };
    }

    if ((exercise.weight ?? 0) < 0) {
      return {
        message: 'Vikten kan inte vara negativ.',
        success: false,
      };
    }
  }

  return {
    message: 'Validation lyckades.',
    success: true,
  };
}
