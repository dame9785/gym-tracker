export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export type MealFoodViewModel = {
  id: number;
  name: string;
};

export type MealItemViewModel = {
  id: number;
  grams: number;

  calories: number;
  protein: number;
  carbs: number;
  fat: number;

  food: MealFoodViewModel;
};

export type TodayMealViewModel = {
  id: number;
  name: string;

  mealType: MealType | null;

  loggedAt: Date;

  items: MealItemViewModel[];
};

export interface TodayMealApiResponse {
  meals: TodayMealViewModel[];
}

export type FoodResponse = FoodViewModel[];

export type CreateFoodResponse = FoodViewModel;

export type UpdateFoodResponse = FoodViewModel;

export interface FoodDeleteApiResponse {
  success: boolean;
}
export interface FoodViewModel {
  name: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}
