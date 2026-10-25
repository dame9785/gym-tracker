import { MuscleRole, Prisma } from '@prisma/client';
import type { ExerciseViewModel } from '@/types/exercise-types';

type ExerciseWithMuscles = Prisma.ExerciseGetPayload<{
  include: {
    muscles: {
      include: {
        muscleGroup: true;
      };
    };
  };
}>;

export class ExerciseMapper {
  static exerciseModelToViewModel(exercise: ExerciseWithMuscles): ExerciseViewModel {
    const primaryMuscle = exercise.muscles.find((muscle) => muscle.role === MuscleRole.PRIMARY);

    const secondaryMuscles = exercise.muscles.filter((muscle) => muscle.role === MuscleRole.SECONDARY).map((muscle) => muscle.muscleGroup.name);

    return {
      id: exercise.id,
      name: exercise.name,
      primaryMuscle: primaryMuscle?.muscleGroup.name ?? '',
      secondaryMuscles,
      equipment: exercise.equipment,
      imagePath: exercise.imagePath,
      description: exercise.description,
      instructions: exercise.instructions,
      techniqueTips: exercise.techniqueTips,
    };
  }
}
