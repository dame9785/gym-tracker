//Repository
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
      // const summary = await this.historyRepository.getWorkoutSummary();
      // const history = sessions.map((s) => HistoryMapper.mapHistoryDtoToViewModel(s));

      return {
        success: true,
        data: {
          history: {
            totalWorkouts: totalWorkouts ?? 0,
            totalCompletedWorkouts: totalCompleted ?? 0,
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
