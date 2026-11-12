import type { Prisma, WorkoutSessionStatus } from '@prisma/client';

import type { PaginationViewModel } from '@/types/pagination-types';

export interface HistoryViewModel {
  totalWorkouts: number;
  totalCompletedWorkouts: number;
  totalTrainingTime: TotalTrainingTimeViewModel;
  totalCompletedSets: number;
  workoutSessions: WorkoutSessionWithExercisesViewModel[];
}

export interface TotalTrainingTimeViewModel {
  seconds: number;
  minutes: number;
  hours: number;
}

export type WorkoutSessionWithRelations = Prisma.WorkoutSessionGetPayload<{
  include: {
    exercises: {
      include: {
        sets: true;
      };
    };
  };
}>;

export interface WorkoutSessionWithExercisesViewModel {
  id: number;
  workoutId: number;
  workoutName: string;
  workoutDescription: string | null;
  startedAt: Date;
  finishedAt: Date | null;
  status: WorkoutSessionStatus;
  exercises: HistorySessionExerciseViewModel[];
}

interface HistorySessionExerciseViewModel {
  id: number;
  name: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: string | null;
  description: string;
  instructions: string;
  techniqueTips: string | null;
  order: number;
  note: string | null;
  sets: HistorySessionSetViewModel[];
}

interface HistorySessionSetViewModel {
  id: number;
  setNumber: number;
  targetReps: number;
  targetSeconds: number | null;
  targetWeight: number | null;
  actualReps: number | null;
  actualSeconds: number | null;
  actualWeight: number | null;
  completed: boolean;
  completedAt: Date | null;
}

export interface HistoryResponse {
  history: HistoryViewModel;
  pagination: PaginationViewModel;
}
