//Types
import type { HistoryViewModel, WorkoutSessionWithRelations } from '@/types/history-types';

export class HistoryMapper {
  static mapHistoryDtoToViewModel(session: WorkoutSessionWithRelations): HistoryViewModel {
    const durationInMinutes = session.finishedAt ? Math.round((session.finishedAt.getTime() - session.startedAt.getTime()) / 60000) : 0;

    return {
      id: session.id,
      workoutName: session.workout.name,
      startedAt: session.startedAt.toString(),
      finishedAt: session.finishedAt?.toString() ?? '',
      durationInMinutes,
      exerciseCount: session.exercises.length,
    };
  }
}
