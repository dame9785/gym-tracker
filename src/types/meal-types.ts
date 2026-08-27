import { MealType } from '@prisma/client';

export interface MealsApiResponse {
  meals: MealViewModel[];
}

export type MealItemViewModel = {
  id: number;
  foodId: number;
  foodName: string;

  grams: number;

  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type MealViewModel = {
  id: number;
  name: string;
  mealType: MealType | null;
  loggedAt: Date;

  items: MealItemViewModel[];
};
