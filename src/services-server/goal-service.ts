import { GoalRepository } from '@/repositories/goal-repository';
import { ErrorResponse, ApiResponse, SuccessResponse } from '@/types/api-types';
import { GoalTypeMapper } from '@/mapping/goal-type-mapping';
import { GoalTypeViewModel, GoalViewModel } from '@/types/goal-types';

const goalRepository = new GoalRepository();

export class GoalTypesService {
  async getAllGoals(): Promise<ApiResponse<GoalTypeViewModel[]>> {
    try {
      const goalTypes = await goalRepository.getAllGoals();
      const viewModel = goalTypes.map((goalType) => GoalTypeMapper.goalTypeDbToViewModel(goalType));

      return {
        success: true,
        data: viewModel,
      } satisfies SuccessResponse<GoalTypeViewModel[]>;
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: 'Server error',
      } satisfies ErrorResponse;
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
