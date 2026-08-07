//Types
import type { WeeklyWorkoutViewModel } from '@/types/workout-types';
import type { WorkoutExerciseViewModel } from '@/types/exercise-types';

//Prisma
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
        sessions: true;
      };
    };
  };
}>;

export function mapWeeklyOverview(workouts: WeeklyOverview[]): WeeklyWorkoutViewModel[] {
  return workouts.map((workout) => {
    const exercises: WorkoutExerciseViewModel[] = workout.workout.exercises.map((workoutExercise) => ({
      exerciseId: workoutExercise.exercise.id,
      name: workoutExercise.exercise.name,
      sets: workoutExercise.sets,
      reps: workoutExercise.reps,
      weight: workoutExercise.weight,
      order: workoutExercise.order,
    }));

    const latestSession = workout.workout.sessions[0];

    return {
      id: workout.workout.id,
      workoutName: workout.workout.name,
      date: workout.date.toISOString(),
      exerciseCount: exercises.length,
      estimatedMinutes: 45,
      activeSessionId: latestSession?.id ?? null,
      status: latestSession?.status,
      exercises,
    };
  });
}
