import { WorkoutSessionMapper } from '@/mapping/workout-session-mapping';
import { HistoryRepository } from '@/repositories/history-repository';

import type { ErrorResponse, ApiResponse, HistoryApiResponse } from '@/types/api-types';

export class HistoryService {
  private historyRepository = new HistoryRepository();

  async getHistory(page: number, userId: number): Promise<ApiResponse<HistoryApiResponse>> {
    try {
      
      const pageSize = 9;
      const totalPages = Math.ceil(totalWorkouts / pageSize);

      const [
  totalWorkouts,
  totalCompleted,
  totalTrainingTime,
  totalCompletedSets,
  workoutSessions,
] = await Promise.all([
  this.historyRepository.getAllWorkoutSessionsCount(userId),
  this.historyRepository.getTotalCompletedWorkout(userId),
  this.historyRepository.getTotalTrainingTime(userId),
  this.historyRepository.getTotalSets(userId),
  this.historyRepository.getAllWorkoutSessions(userId, page, pageSize),
]);

      return {
        success: true,
        data: {
          history: {
            totalWorkouts: totalWorkouts ?? 0,
            totalCompletedWorkouts: totalCompleted ?? 0,

            totalTrainingTime: {
              seconds: totalTrainingTime.seconds,
              minutes: totalTrainingTime.minutes,
              hours: totalTrainingTime.hours,
            },

            totalCompletedSets,
            workoutSessions: workoutSessions.map((x) => WorkoutSessionMapper.mapWorkoutSessionWithExericses(x)),
          },
          pagination: {
            currentPage: page,
            totalPages,
            pageSize,
            totalItems: totalWorkouts,
          },
        },
      } satisfies ApiResponse<HistoryApiResponse>;
    } catch (error) {
      console.error('Error while fetching history data', error);

      return {
        success: false,
        message: 'Could not load workout history.',
      } satisfies ErrorResponse;
    }
  }
}
