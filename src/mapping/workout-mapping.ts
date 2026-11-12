import type { Prisma } from '@prisma/client';

import type { WorkoutViewModel, EditWorkoutViewModel } from '@/types/workout-types';

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
  private static mapWorkoutExercises(workout: WorkoutWithExercises) {
    return workout.exercises.map((workoutExercise) => ({
      exerciseId: workoutExercise.exerciseId,
      name: workoutExercise.exercise.name,
      sets: workoutExercise.sets,
      reps: workoutExercise.reps ?? 0,
      weight: workoutExercise.weight ?? 0,
      seconds: workoutExercise.seconds ?? 0,
      note: workoutExercise.note ?? '',
      order: workoutExercise.order,
    }));
  }

  static workoutDtoToViewModel(workout: WorkoutWithExercises): WorkoutViewModel {
    return {
      id: workout.id,
      name: workout.name,
      description: workout.description ?? '',
      createdAt: workout.createdAt,
      updatedAt: workout.updatedAt,
      workoutExercises: this.mapWorkoutExercises(workout),
    };
  }

  static workoutDtoToEditViewModel(workout: WorkoutWithExercises): EditWorkoutViewModel {
    return {
      id: workout.id,
      name: workout.name,
      description: workout.description ?? '',
      workoutExercises: this.mapWorkoutExercises(workout),
    };
  }

  static workoutDtosToViewModels(workouts: WorkoutWithExercises[]): WorkoutViewModel[] {
    return workouts.map((workout) => this.workoutDtoToViewModel(workout));
  }
}
