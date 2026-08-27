import type { CalorieGoal } from '@/types/calorie-types';

type NutritionInput = {
  weight: number;
  calories: number;
  goal: CalorieGoal;
};

export function calculateNutrition({ weight, calories, goal }: NutritionInput) {
  // Protein per kg kroppsvikt
  const proteinPerKg = goal === 'MUSCLE_GAIN' ? 2 : goal === 'WEIGHT_LOSS' ? 2 : 1.8;

  const protein = Math.round(weight * proteinPerKg);

  // Fett: cirka 25% av dagens kalorier
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
