import { RegisterWorkoutDto } from '@/dto/register-workout-dto';
import { EditWorkoutDto } from '@/dto/edit-workout-dto';

interface ValidationResult {
  message: string;
  success: boolean;
}

type WorkoutDto = RegisterWorkoutDto | EditWorkoutDto;

export function validateWorkoutHelper(formData: WorkoutDto): ValidationResult {
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
