import { GoalType } from '@prisma/client';

export interface CalorieCalculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  goalType: GoalType;
}

export interface CalorieCalculatorResult {
  bmr: number;
  maintenanceCalories: number;
  weightLossCalories: number;
  muscleGainCalories: number;
}

export interface NutritionGoals {
  recomendedCaloriesIntake: number;
  recomendedProteinIntake: number;
  recomendedCarbsIntake: number;
  recomendedFatIntake: number;
}
