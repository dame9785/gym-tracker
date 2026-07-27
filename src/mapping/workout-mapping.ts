import { WorkoutViewModel } from '@/view-models/workout-view-model';
import { Workout } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { ExerciseMapper } from '@/mapping/exericse-mapping';

type WorkoutWithExercises = Prisma.WorkoutGetPayload<{
  include: {
    exercises: {
      include: {
        exercise: true;
      };
    };
  };
}>;

export class WorkoutMapper {
  static workoutDtoToViewModel(workout: WorkoutWithExercises): WorkoutViewModel {
    return {
      id: workout.id,
      name: workout.name,
      description: workout.description,
      createdAt: workout.createdAt,
      updatedAt: workout.updatedAt,
      exercises: workout.exercises.map((we) =>
        ExerciseMapper.exerciseModelToViewModel(we.exercise),
      ),
    };
  }

  static workoutDtosToViewModels(workouts: WorkoutWithExercises[]): WorkoutViewModel[] {
    return workouts.map(this.workoutDtoToViewModel);
  }
}
