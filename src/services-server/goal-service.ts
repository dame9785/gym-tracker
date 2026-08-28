import { GoalRepository } from '@/repositories/goal-repository';
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse } from '@/types/api-types';
import { GoalApiResponse } from '@/types/goal-types';
import { GoalTypeMapper } from '@/mapping/goal-type-mapping';
import { GoalViewModel } from '@/types/goal-types';

const goalRepository = new GoalRepository();

export default class GoalTypesService {
  async getAllGoals(): Promise<ApiResponse<GoalApiResponse>> {
    try {
      const goalTypes = await goalRepository.getAllGoals();
      const viewModel = goalTypes.map((goalType) => GoalTypeMapper.goalTypeDbToViewModel(goalType));

      return {
        success: true,
        data: viewModel,
      } satisfies ApiSuccessResponse<GoalApiResponse>;
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Server error',
      } satisfies ApiErrorResponse;
    }
  }
  async getUserGoal(userId: number): Promise<GoalViewModel | null> {
    const goal = await goalRepository.getByUserId(userId);

    if (!goal) {
      return null;
    }

    return GoalTypeMapper.goalToViewModel(goal);
  }
}
