export interface CalorieCalculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  activityLevel: 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'VERY_ACTIVE' | 'EXTRA_ACTIVE';
}

export interface CalorieCalculatorResult {
  bmr: number;
  maintenanceCalories: number;
  weightLossCalories: number;
  muscleGainCalories: number;
}

export interface NutritionGoals {
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}
