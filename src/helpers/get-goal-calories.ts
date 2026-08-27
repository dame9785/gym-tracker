import type { CalorieCalculatorResult, CalorieGoal } from '@/types/calorie-types';

export function getGoalCalories(calorieGoal: CalorieGoal, calorieStats: CalorieCalculatorResult) {
  switch (calorieGoal) {
    case 'WEIGHT_LOSS':
      return calorieStats.weightLossCalories;

    case 'MUSCLE_GAIN':
      return calorieStats.muscleGainCalories;

    case 'MAINTENANCE':
    default:
      return calorieStats.maintenanceCalories;
  }
}
