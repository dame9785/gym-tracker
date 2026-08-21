import { Prisma } from '@prisma/client';
import type { WorkoutSessionViewModel } from '@/types/workout-types';

export interface HistoryViewModel {
  totalWorkouts: number;
  totalCompletedWorkouts: number;
  totalTrainingTime: TotalTrainingTimeViewModel;
  totalCompletedSets: number;
  workoutSessions: WorkoutSessionWithExercisesViewModel[];
}

export type TotalTrainingTimeViewModel = {
  seconds: number;
  minutes: number;
  hours: number;
};

export type WorkoutSessionWithRelations = Prisma.WorkoutSessionGetPayload<{
  include: {
    workout: true;
    exercises: {
      include: {
        workoutExercise: {
          include: {
            exercise: true;
          };
        };
        sets: true;
      };
    };
  };
}>;

export type WorkoutSessionWithExercisesViewModel = {
  id: number;
  workoutId: number;
  workoutName: string;
  workoutDescription: string | null;
  startedAt: Date;
  finishedAt: Date | null;
  status: string;
  exercises: WorkoutSessionExerciseViewModel[];
};

export type WorkoutSessionExerciseViewModel = {
  id: number;
  name: string;
  muscleGroup: string;
  equipment: string | null;
  order: number;
  note: string | null;

  sets: WorkoutSessionSetViewModel[];
};

export type WorkoutSessionSetViewModel = {
  id: number;
  setNumber: number;
  targetReps: number;
  targetWeight: number | null;
  actualReps: number | null;
  actualWeight: number | null;
  completed: boolean;
  completedAt: Date | null;
};
