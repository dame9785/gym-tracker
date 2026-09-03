import { GoalType } from '@prisma/client';

// Goal Type

export type GoalApiResponse = GoalTypeViewModel[];

export interface GoalTypeViewModel {
  id: number;
  title: string;
}

export interface GoalViewModel {
  calorieGoal: GoalType;
}

// Calorie Calculator

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
