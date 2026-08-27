export type ActivityLevel = 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'VERY_ACTIVE' | 'EXTRA_ACTIVE';

export type CalorieGoal = 'WEIGHT_LOSS' | 'MAINTENANCE' | 'MUSCLE_GAIN';

export type CalorieCalculatorInput = {
  weight: number;
  height: number;
  age: number;
  gender: 'MALE' | 'FEMALE';
  activityLevel: ActivityLevel;
};

export type CalorieCalculatorResult = {
  bmr: number;
  maintenanceCalories: number;
  weightLossCalories: number;
  muscleGainCalories: number;
};

export type CreateCalorieLogInput = {
  calories: number;
};

export type NutritionGoalInput = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type CalorieLog = {
  id: number;
  userId: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  loggedAt: string;
};

export type TodayCaloriesResult = {
  calories: number;
};

export type CalorieHistoryResult = CalorieLog[];

export type NutritionGoal = {
  calorieGoal: CalorieGoal;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

export type CurrentNuitrationStats = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type NutritionLogInput = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};
