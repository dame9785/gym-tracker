import { GoalRepository } from '@/repositories/goal-repository';
import { ApiResponse, SuccessResponse } from '@/types/api-types';
import { GoalTypeMapper } from '@/mapping/goal-type-mapping';
import { GoalTypeViewModel, GoalViewModel } from '@/types/goal-types';
import { GoalType } from '@prisma/client';
const goalRepository = new GoalRepository();

export class GoalTypesService {
  async getAllGoals(): Promise<ApiResponse<GoalTypeViewModel[]>> {
    const goalTypes: GoalType[] = [GoalType.WEIGHT_LOSS, GoalType.MUSCLE_GAIN, GoalType.MAINTENANCE];

    const viewModel = goalTypes.map((goalType) => GoalTypeMapper.goalTypeDbToViewModel(goalType));

    return {
      success: true,
      data: viewModel,
    } satisfies SuccessResponse<GoalTypeViewModel[]>;
  }
  async getUserGoal(userId: number): Promise<GoalViewModel | null> {
    const goal = await goalRepository.getByUserId(userId);

    if (!goal) {
      return null;
    }

    return GoalTypeMapper.goalToViewModel(goal);
  }
}
