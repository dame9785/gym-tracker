import { Prisma } from '@prisma/client';

export interface HistoryViewModel {
  id: number;
  workoutName: string;
  startedAt: string;
  finishedAt: string | null;
  durationInMinutes: number;
  exerciseCount: number;
}

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
