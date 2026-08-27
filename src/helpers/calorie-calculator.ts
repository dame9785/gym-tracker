import type { ActivityLevel, CalorieCalculatorInput, CalorieCalculatorResult } from '@/types/calorie-types';

const activityMultipliers: Record<ActivityLevel, number> = {
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  VERY_ACTIVE: 1.725,
  EXTRA_ACTIVE: 1.9,
};

export function calculateCalories({ weight, height, age, gender, activityLevel }: CalorieCalculatorInput): CalorieCalculatorResult {
  const bmr = gender === 'MALE' ? 10 * weight + 6.25 * height - 5 * age + 5 : 10 * weight + 6.25 * height - 5 * age - 161;

  const maintenanceCalories = bmr * activityMultipliers[activityLevel];

  return {
    bmr: Math.round(bmr),
    maintenanceCalories: Math.round(maintenanceCalories),
    weightLossCalories: Math.round(maintenanceCalories - 500),
    muscleGainCalories: Math.round(maintenanceCalories + 300),
  };
}

// Returnerar dagens datum utan klockslag
export function getDateOnly(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
