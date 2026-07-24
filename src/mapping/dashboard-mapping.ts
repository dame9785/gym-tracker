import {
  WeeklyWorkoutViewModel,
  WorkoutExerciseViewModel,
} from '@/view-models/dashboard-view-model';
import { Prisma } from '@prisma/client';

type WeeklyOverview = Prisma.WorkoutScheduleGetPayload<{
  include: {
    workout: {
      include: {
        exercises: {
          include: {
            exercise: true;
          };
        };
      };
    };
  };
}>;

export function mapWeeklyOverview(workouts: WeeklyOverview[]): WeeklyWorkoutViewModel[] {
  return workouts.map((workout) => {
    const exercises: WorkoutExerciseViewModel[] = workout.workout.exercises.map(
      (workoutExercise) => ({
        id: workoutExercise.exercise.id,
        name: workoutExercise.exercise.name,
        sets: workoutExercise.sets,
        reps: workoutExercise.reps,
        weight: workoutExercise.weight,
        order: workoutExercise.order,
      }),
    );

    return {
      id: workout.workout.id,
      workoutName: workout.workout.name,
      date: workout.date.toISOString(),

      exerciseCount: exercises.length,

      // Tillfälligt värde tills vi räknar ut tiden från övningarna
      estimatedMinutes: 45,

      completed: false,

      exercises,
    };
  });
}
