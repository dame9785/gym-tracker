import { GoalTypeViewModel, GoalViewModel } from '@/types/goal-types';
import type { Goal, GoalType } from '@prisma/client';

export class GoalTypeMapper {
  static goalTypeDbToViewModel(goalType: GoalType): GoalTypeViewModel {
    return {
      id: goalType.id,
      title: goalType.title,
    };
  }

  static goalToViewModel(goal: Goal): GoalViewModel {
    return {
      calorieGoal: goal.calorieGoal,

      calories: goal.calories,
      protein: goal.protein,
      carbs: goal.carbs,
      fat: goal.fat,
    };
  }
}
