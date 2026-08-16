import { Exercise } from '@prisma/client';
import type { ExerciseViewModel } from '@/types/exercise-types';
export class ExerciseMapper {
  static exerciseModelToViewModel(exercise: Exercise): ExerciseViewModel {
    return {
      id: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment,
    };
  }
}
