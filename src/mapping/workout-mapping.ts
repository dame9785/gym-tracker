import { WorkoutViewModel } from '@/view-models/workout-view-model';
import { Prisma } from '@prisma/client';
import { ExerciseMapper } from '@/mapping/exericse-mapping';
import { EditWorkoutViewModel } from '@/view-models/workout-edit-view-model';

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
      exercise: workout.exercises.map((we) => ExerciseMapper.exerciseModelToViewModel(we.exercise)),
    };
  }

  static workoutDtoToEditViewModel(workout: WorkoutWithExercises): EditWorkoutViewModel {
    return {
      name: workout.name,
      description: workout.description ?? '',
      workoutExercises: workout.exercises.map((we) => ({
        exerciseId: we.exerciseId,
        name: we.exercise.name, // om du har med name i ViewModel
        sets: we.sets,
        reps: we.reps,
        weight: we.weight,
        note: we.note,
      })),
    };
  }

  static workoutDtosToViewModels(workouts: WorkoutWithExercises[]): WorkoutViewModel[] {
    return workouts.map(this.workoutDtoToViewModel);
  }
}
