//Types
import type { WorkoutViewModel, EditWorkoutViewModel } from '@/types/workout-types';

//Prisma
import { Prisma } from '@prisma/client';

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
      description: workout.description ?? '',
      createdAt: workout.createdAt,
      updatedAt: workout.updatedAt,
      workoutExercises: workout.exercises.map((we) => ({
        exerciseId: we.exerciseId,
        name: we.exercise.name,
        sets: we.sets,
        reps: we.reps ?? 0,
        weight: we.weight ?? 0,
        seconds: we.seconds ?? 0,
        note: we.note ?? '',
        order: we.order,
      })),
    };
  }

  static workoutDtoToEditViewModel(workout: WorkoutWithExercises): EditWorkoutViewModel {
    return {
      id: workout.id,
      name: workout.name,
      description: workout.description ?? '',
      workoutExercises: workout.exercises.map((we) => ({
        exerciseId: we.exerciseId,
        name: we.exercise.name,
        sets: we.sets,
        reps: we.reps ?? 0,
        weight: we.weight ?? 0,
        seconds: we.seconds ?? 0,
        note: we.note ?? '',
        order: we.order,
      })),
    };
  }

  static workoutDtosToViewModels(workouts: WorkoutWithExercises[]): WorkoutViewModel[] {
    return workouts.map(this.workoutDtoToViewModel);
  }
}
