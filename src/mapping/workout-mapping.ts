import { Prisma } from '@prisma/client';
import { WorkoutExerciseViewModel, WorkoutViewModel } from '@/view-models/workout-view-model';

type Workout = Prisma.WorkoutGetPayload<{
  include: {
    exercises: {
      include: {
        exercise: true;
      };
    };
  };
}>;

export function mapWorkout(workout: Workout): WorkoutViewModel {
  const exercises: WorkoutExerciseViewModel[] = workout.exercises.map((workoutExercise) => ({
    id: workoutExercise.exercise.id,
    name: workoutExercise.exercise.name,
    sets: workoutExercise.sets,
    reps: workoutExercise.reps,
    weight: workoutExercise.weight,
    restSeconds: workoutExercise.restSeconds,
    order: workoutExercise.order,
  }));

  return {
    id: workout.id,
    name: workout.name,
    description: workout.description,
    exercises,
  };
}
