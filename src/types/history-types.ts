import { Prisma } from '@prisma/client';

export interface HistoryViewModel {
  totalWorkouts: number;
  totalCompletedWorkouts: number;
  totalTrainingTime: TotalTrainingTimeViewModel;
  totalCompletedSets: number;
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
