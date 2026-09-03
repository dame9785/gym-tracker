import { GoalType } from '@prisma/client';
import type { CalorieCalculatorResult, NutritionGoals } from '@/types/calorie-types';

type CalorieInput = {
  weight: number;
  height: number;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
};

/**
 * Calculates estimated daily calorie requirements.
 *
 * Uses the Mifflin-St Jeor equation to calculate BMR.
 */
export function calculateCalorieStats({ weight, height, age, gender }: CalorieInput): CalorieCalculatorResult {
  let bmr: number;

  if (gender === 'MALE') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (gender === 'FEMALE') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 78;
  }

  const maintenanceCalories = Math.round(bmr * 1.55);

  const weightLossCalories = Math.round(maintenanceCalories - 500);

  const muscleGainCalories = Math.round(maintenanceCalories + 300);

  return {
    bmr: Math.round(bmr),
    maintenanceCalories,
    weightLossCalories,
    muscleGainCalories,
  };
}

/**
 * Calculates recommended protein, carbohydrates and fat.
 */
type NutritionInput = {
  weight: number;
  calories: number;
  goal: GoalType;
};

export function calculateNutrition({ weight, calories, goal }: NutritionInput): NutritionGoals {
  const proteinPerKg = goal === GoalType.MUSCLE_GAIN ? 2 : goal === GoalType.WEIGHT_LOSS ? 2 : 1.8;

  const protein = Math.round(weight * proteinPerKg);

  // 25% of calories from fat
  const fat = Math.round((calories * 0.25) / 9);

  const proteinCalories = protein * 4;
  const fatCalories = fat * 9;

  const remainingCalories = calories - proteinCalories - fatCalories;

  const carbs = Math.round(remainingCalories / 4);

  return {
    recomendedCaloriesIntake: calories,
    recomendedCarbsIntake: carbs,
    recomendedFatIntake: fat,
    recomendedProteinIntake: protein,
  };
}
