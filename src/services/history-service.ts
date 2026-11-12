import { WorkoutSessionMapper } from '@/mapping/workout-session-mapping';
import { HistoryRepository } from '@/repositories/history-repository';

import type { ServiceResponse } from '@/types/service-types';
import type { HistoryResponse } from '@/types/history-types';

export class HistoryService {
  private readonly historyRepository = new HistoryRepository();

  private readonly pageSize = 9;

  async getHistory(page: number, userId: number): Promise<ServiceResponse<HistoryResponse>> {
    try {
      const [totalWorkouts, totalCompleted, totalTrainingTime, totalCompletedSets, workoutSessions] = await Promise.all([
        this.historyRepository.getAllWorkoutSessionsCount(userId),
        this.historyRepository.getTotalCompletedWorkout(userId),
        this.historyRepository.getTotalTrainingTime(userId),
        this.historyRepository.getTotalSets(userId),
        this.historyRepository.getAllWorkoutSessions(userId, page, this.pageSize),
      ]);

      const totalPages = Math.ceil(totalWorkouts / this.pageSize);

      return {
        success: true,
        data: {
          history: {
            totalWorkouts,
            totalCompletedWorkouts: totalCompleted,
            totalTrainingTime: {
              seconds: totalTrainingTime.seconds,
              minutes: totalTrainingTime.minutes,
              hours: totalTrainingTime.hours,
            },
            totalCompletedSets,
            workoutSessions: workoutSessions.map((session) => WorkoutSessionMapper.mapWorkoutSessionWithExericses(session)),
          },
          pagination: {
            currentPage: page,
            totalPages,
            pageSize: this.pageSize,
            totalItems: totalWorkouts,
          },
        },
      } satisfies ServiceResponse<HistoryResponse>;
    } catch (error: unknown) {
      console.error('[HistoryService.getHistory]', error);

      return {
        success: false,
        message: 'Could not load workout history.',
      } satisfies ServiceResponse<HistoryResponse>;
    }
  }
}
