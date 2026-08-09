import { GoalTypeViewModel } from '@/types/goal-types';
import type { GoalType } from '@prisma/client';

export class GoalTypeMapper {
  static goalTypeDbToViewModel(goalType: GoalType): GoalTypeViewModel {
    return {
      id: goalType.id,
      title: goalType.title,
    };
  }
}
