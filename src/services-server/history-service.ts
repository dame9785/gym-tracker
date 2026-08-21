//Repository
import { WorkoutSessionMapper } from '@/mapping/workout-session-mapping';
import { HistoryRepository } from '@/repositories/history-repository';
import { WorkoutRepository } from '@/repositories/workout-repository';

//Types
import { ApiErrorResponse, ApiResponse, HistoryApiResponse } from '@/types/api-types';

export class HistoryService {
  private historyRepository = new HistoryRepository();
  private workoutRepository = new WorkoutRepository();

  async getHistory(userId: number): Promise<ApiResponse<HistoryApiResponse>> {
    try {
      const totalWorkouts = await this.historyRepository.getAllWorkoutSessionsCount(userId);
      const totalCompleted = await this.historyRepository.getTotalCompletedWorkout(userId);
      const totalTrainingTime = await this.historyRepository.getTotalTrainingTime(userId);
      const totalCompeletedSets = await this.historyRepository.getTotalSets(userId);
      const workoutSessions = await this.historyRepository.getCompletedWorkoutSessions(userId);

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
            totalCompletedSets: totalCompeletedSets,
            workoutSessions: workoutSessions.map((x) => WorkoutSessionMapper.mapWorkoutSessionWithExericses(x)),
          },
        },
      } satisfies ApiResponse<HistoryApiResponse>;
    } catch (error) {
      return {
        success: false,
        message: 'Could not load workout history.',
      } satisfies ApiErrorResponse;
    }
  }
}
