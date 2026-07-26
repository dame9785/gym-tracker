import { Exercise } from '@prisma/client';
import ExerciseViewModel from '@/view-models/excercise-view-model';
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
