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
        sessions: true;
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

    const latestSession = workout.workout.sessions[0];

    return {
      id: workout.workout.id,
      workoutName: workout.workout.name,
      date: workout.date.toISOString(),
      exerciseCount: exercises.length,
      estimatedMinutes: 45,
      completed: latestSession?.status === 'COMPLETED',
      hasActiveSession: latestSession?.status === 'ACTIVE',
      activeSessionId: latestSession?.id ?? null,
      exercises,
    };
  });
}
