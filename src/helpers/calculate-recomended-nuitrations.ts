import { GoalType } from '@prisma/client';
import type { NutritionGoals } from '@/types/goal-types';

type NutritionInput = {
  weight: number;
  calories: number;
  goal: GoalType;
};

export function calculateNutrition({ weight, calories, goal }: NutritionInput): NutritionGoals {
  const proteinPerKg = goal === GoalType.MUSCLE_GAIN ? 2 : goal === GoalType.WEIGHT_LOSS ? 2 : 1.8;

  const protein = Math.round(weight * proteinPerKg);

  // 25 % av kalorierna från fett
  const fat = Math.round((calories * 0.25) / 9);

  // Resterande kalorier går till kolhydrater
  const proteinCalories = protein * 4;
  const fatCalories = fat * 9;

  const remainingCalories = calories - proteinCalories - fatCalories;

  const carbs = Math.round(remainingCalories / 4);

  return {
    calories,
    protein,
    carbs,
    fat,
  };
}
