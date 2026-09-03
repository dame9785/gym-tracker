import { GoalType } from '@prisma/client';
import type { CalorieCalculatorResult } from '@/types/calorie-types';

export function getGoalCalories(goalType: GoalType, calorieStats: CalorieCalculatorResult): number {
  switch (goalType) {
    case GoalType.WEIGHT_LOSS:
      return calorieStats.weightLossCalories;

    case GoalType.MUSCLE_GAIN:
      return calorieStats.muscleGainCalories;

    case GoalType.MAINTENANCE:
      return calorieStats.maintenanceCalories;

    default:
      return calorieStats.maintenanceCalories;
  }
}
