import { GoalRepository } from '@/repositories/goal-repository';
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse, GoalResponse } from '@/types/api-types';
import { GoalTypeMapper } from '@/mapping/goal-type-mapping';

const goalRepository = new GoalRepository();

export class GoalTypesService {
  async getAllGoals(): Promise<ApiResponse<GoalResponse>> {
    try {
      const goalTypes = await goalRepository.getAllGoals();
      const viewModel = goalTypes.map((goalType) => GoalTypeMapper.goalTypeDbToViewModel(goalType));

      return {
        success: true,
        data: { goals: viewModel },
      } satisfies ApiSuccessResponse<GoalResponse>;
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Server error',
      } satisfies ApiErrorResponse;
    }
  }
}
