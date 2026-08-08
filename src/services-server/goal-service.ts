import type { GoalTypeViewModel } from '@/types/goal-types';
import { GoalRepository } from '@/repositories/goal-repository';

const goalRepository = new GoalRepository();

export class GoalTypesService {
  async getAllGoals(): Promise<GoalTypeViewModel[]> {
    return goalRepository.getAllGoals();
  }
}
