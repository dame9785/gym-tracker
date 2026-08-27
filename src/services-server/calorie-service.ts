import { CalorieRepository } from '@/repositories/calorie-repository';
import { ApiResponse, ApiSuccessResponse } from '@/types/api-types';
import type { CalorieGoal, CurrentNuitrationStats, NutritionLogInput } from '@/types/calorie-types';

const calorieRepository = new CalorieRepository();

export class CalorieService {
  async getCalorieGoal(userId: number) {
    return calorieRepository.getCalorieGoal(userId);
  }

  async updateNutritionGoal(
    userId: number,
    data: {
      calorieGoal: CalorieGoal;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    },
  ) {
    return calorieRepository.updateNutritionGoal(userId, data);
  }

  async getCurrentNutrition(userId: number): Promise<CurrentNuitrationStats | null> {
    return calorieRepository.getCurrentNutritionStats(userId);
  }

  // Spara dagens näringsintag
  async saveNutritionLog(userId: number, data: NutritionLogInput) {
    return calorieRepository.upsertNutritionLog(userId, data);
  }

  // Lägg till endast kalorier
  async addCalories(userId: number, calories: number) {
    return calorieRepository.addCalories(userId, calories);
  }

  // Hämta dagens näringsintag
  async getTodaysCalorie(userId: number) {
    return calorieRepository.getTodayCalorieLog(userId);
  }

  // Hämta historik
  async getHistory(userId: number) {
    return calorieRepository.getCalorieHistory(userId);
  }
}
