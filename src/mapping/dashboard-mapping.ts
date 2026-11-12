import type { Prisma } from '@prisma/client';

import type { WeeklyWorkoutViewModel } from '@/types/workout-types';
import type { WorkoutExerciseViewModel } from '@/types/exercise-types';

type WeeklyOverview = Prisma.WorkoutScheduleGetPayload<{
  include: {
    sessions: true;
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
  return workouts.map((workoutSchedule) => {
    const exercises: WorkoutExerciseViewModel[] = workoutSchedule.workout.exercises.map((workoutExercise) => ({
      exerciseId: workoutExercise.exercise.id,
      name: workoutExercise.exercise.name,
      sets: workoutExercise.sets,
      reps: workoutExercise.reps ?? 0,
      weight: workoutExercise.weight ?? 0,
      order: workoutExercise.order,
      seconds: workoutExercise.seconds ?? 0,
    }));

    const latestSession = workoutSchedule.sessions.reduce<(typeof workoutSchedule.sessions)[number] | null>((latest, session) => {
      if (!latest || session.startedAt > latest.startedAt) {
        return session;
      }

      return latest;
    }, null);

    return {
      id: workoutSchedule.id,
      workoutId: workoutSchedule.workout.id,
      workoutName: workoutSchedule.workout.name,
      date: workoutSchedule.date.toISOString(),
      exerciseCount: exercises.length,
      estimatedMinutes: workoutSchedule.workout.estimatedMinutes ?? 0,
      activeSessionId: latestSession?.id ?? null,
      status: latestSession?.status ?? null,
      exercises,
    };
  });
}
