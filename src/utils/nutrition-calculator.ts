import { ActivityLevel, Gender, GoalType, MetabolicSex } from '@prisma/client';

// --------------------------------------------------
// Types
// --------------------------------------------------

type NutritionCalculationInput = {
  gender: Gender;
  metabolicSex: MetabolicSex | null;
  birthDate: Date;
  height: number;
  bodyWeight: number;
  activityLevel: ActivityLevel;
  goalType: GoalType;
};

export type NutritionCalculationResult = {
  age: number;
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

// --------------------------------------------------
// Nutrition Calculator
// --------------------------------------------------

export class NutritionCalculator {
  private readonly activityMultipliers: Record<ActivityLevel, number> = {
    [ActivityLevel.SEDENTARY]: 1.2,
    [ActivityLevel.LIGHT]: 1.375,
    [ActivityLevel.MODERATE]: 1.55,
    [ActivityLevel.ACTIVE]: 1.725,
    [ActivityLevel.VERY_ACTIVE]: 1.9,
  };

  calculate(input: NutritionCalculationInput): NutritionCalculationResult {
    this.validateInput(input);

    const age = this.calculateAge(input.birthDate);
    const metabolicSex = this.getMetabolicSex(input);

    const weight = input.bodyWeight;
    const height = input.height;

    // Mifflin-St Jeor formula
    const bmr = 10 * weight + 6.25 * height - 5 * age + (metabolicSex === MetabolicSex.MALE ? 5 : -161);

    const tdee = bmr * this.activityMultipliers[input.activityLevel];

    const calories = this.calculateCalories(tdee, input.goalType);

    const protein = this.calculateProtein(weight, input.goalType);
    const fat = Math.round(weight * 0.8);

    const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));

    return {
      age,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calories: Math.round(calories),
      protein,
      carbs,
      fat,
    };
  }

  // --------------------------------------------------
  // Calculate age
  // --------------------------------------------------

  private calculateAge(birthDate: Date): number {
    const today = new Date();

    let age = today.getUTCFullYear() - birthDate.getUTCFullYear();

    const monthDifference = today.getUTCMonth() - birthDate.getUTCMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getUTCDate() < birthDate.getUTCDate())) {
      age--;
    }

    if (age < 18) {
      throw new Error('Nutrition recommendations are only available for adults.');
    }

    return age;
  }

  // --------------------------------------------------
  // Get metabolic sex
  // --------------------------------------------------

  private getMetabolicSex(input: NutritionCalculationInput): MetabolicSex {
    if (input.gender === Gender.MALE) {
      return MetabolicSex.MALE;
    }

    if (input.gender === Gender.FEMALE) {
      return MetabolicSex.FEMALE;
    }

    if (input.metabolicSex) {
      return input.metabolicSex;
    }

    throw new Error('Metabolic sex must be selected before calculating nutrition goals.');
  }

  // --------------------------------------------------
  // Calculate calories
  // --------------------------------------------------

  private calculateCalories(tdee: number, goalType: GoalType): number {
    switch (goalType) {
      case GoalType.WEIGHT_LOSS:
        return tdee * 0.85;

      case GoalType.MUSCLE_GAIN:
        return tdee * 1.08;

      case GoalType.MAINTENANCE:
        return tdee;

      default:
        throw new Error('Unsupported nutrition goal.');
    }
  }

  // --------------------------------------------------
  // Calculate protein
  // --------------------------------------------------

  private calculateProtein(weight: number, goalType: GoalType): number {
    const proteinMultiplier = goalType === GoalType.WEIGHT_LOSS ? 1.8 : 1.6;

    return Math.round(weight * proteinMultiplier);
  }

  // --------------------------------------------------
  // Validate input
  // --------------------------------------------------

  private validateInput(input: NutritionCalculationInput): void {
    if (!Number.isFinite(input.bodyWeight) || input.bodyWeight <= 0) {
      throw new Error('Body weight must be greater than zero.');
    }

    if (!Number.isFinite(input.height) || input.height <= 0) {
      throw new Error('Height must be greater than zero.');
    }

    if (Number.isNaN(input.birthDate.getTime())) {
      throw new Error('Invalid birth date.');
    }
  }
}
