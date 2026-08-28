import { GoalViewModel } from './goal-types';

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface MealFood {
  id: number;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

export interface MealItem {
  id: number;
  mealId: number;
  foodId: number;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  food: MealFood;
}

export interface Meal {
  id: number;
  userId: number;
  name: string;
  mealType: MealType;
  loggedAt: string;
  createdAt: string;
  updatedAt: string;
  items: MealItem[];
}

export interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface TodayMealsApiResponse {
  meals: MealViewModel[];
  totals: NutritionTotals;
  goal: NutritionTotals;
}

export interface MealViewModel {
  id: number;
  userId: number;
  mealType: MealType;
  createdAt: string;
  updatedAt: string;
  items: MealItemViewModel[];
}

export interface MealItemViewModel {
  id: number;
  foodId: number;
  mealId: number;
  grams: number;

  calories: number;
  protein: number;
  carbs: number;
  fat: number;

  food: FoodViewModel;
}

export interface FoodViewModel {
  id: number;
  name: string;

  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}
