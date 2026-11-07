//Types
import type { WeeklyWorkoutViewModel } from '@/types/workout-types';
import type { WorkoutExerciseViewModel } from '@/types/exercise-types';

//Prisma
import { Prisma } from '@prisma/client';

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

    // Get the latest session belonging to this specific schedule.
    const latestSession = [...workoutSchedule.sessions].sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0];

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
