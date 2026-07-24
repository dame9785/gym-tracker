import { HistoryViewModel } from '@/view-models/history-view-model';
import { Prisma } from '@prisma/client';

type WorkoutSessionWithRelations = Prisma.WorkoutSessionGetPayload<{
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

export function mapToHistoryViewModel(session: WorkoutSessionWithRelations): HistoryViewModel {
  const durationInMinutes = session.finishedAt
    ? Math.round((session.finishedAt.getTime() - session.startedAt.getTime()) / 60000)
    : 0;

  return {
    id: session.id,
    workoutName: session.workout.name,
    startedAt: session.startedAt,
    finishedAt: session.finishedAt,
    durationInMinutes,
    exerciseCount: session.exercises.length,
  };
}
