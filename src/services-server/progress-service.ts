import { ProgressRepository } from '@/repositories/progress-repository';
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse } from '@/types/api-types';
import { ProgressApiResponse } from '@/types/progress-type';

export class ProgressService {
  private progressRepository = new ProgressRepository();

  async getProgress(userId: number): Promise<ApiResponse<ProgressApiResponse>> {
    try {
      const weightProgress = await this.progressRepository.getWeightProgress(userId);
      return {
        success: true,
        data: {
          weightProgress: weightProgress,
        },
      } satisfies ApiSuccessResponse<ProgressApiResponse>;
    } catch (error) {
      console.log('ERROR', error);
      return {
        success: false,
        message: 'Server fel, gick ej hämta progress data',
      } satisfies ApiErrorResponse;
    }
  }
}
