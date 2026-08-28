import type { ApiResponse, ApiSuccessResponse } from '@/types/api-types';
import { errorResponse } from '@/utils/api-error';

import type {
  CalorieCalculatorResult,
  CalorieHistoryResult,
  CalorieLog,
  CurrentNuitrationStats,
  NutritionGoal,
  NutritionLogInput,
} from '@/types/calorie-types';

const API_URL = 'http://localhost:3000/api/calories';

export default class CalorieService {
  static async getCalorieStats(data: unknown, userToken: string): Promise<ApiResponse<CalorieCalculatorResult>> {
    try {
      const response = await fetch(`${API_URL}/calculate`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `token=${userToken}`,
        },
        body: JSON.stringify(data),
      });

      return (await response.json()) as ApiSuccessResponse<CalorieCalculatorResult>;
    } catch (error) {
      console.error('Could not connect to server:', error);

      return errorResponse('Could not connect to the server.');
    }
  }

  // Spara dagens näringsintag
  static async saveNutritionLog(data: NutritionLogInput, userToken: string): Promise<ApiResponse<CalorieLog>> {
    try {
      const response = await fetch(`${API_URL}/upsert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `token=${userToken}`,
        },
        body: JSON.stringify(data),
      });

      return (await response.json()) as ApiSuccessResponse<CalorieLog>;
    } catch (error) {
      console.error('Could not connect to server:', error);

      return errorResponse('Could not connect to the server.');
    }
  }

  static async getTodaysNuitration(userToken: string): Promise<ApiResponse<CurrentNuitrationStats>> {
    try {
      const response = await fetch(`${API_URL}/today`, {
        method: 'GET',
        headers: {
          Cookie: `token=${userToken}`,
        },
      });

      return (await response.json()) as ApiSuccessResponse<CurrentNuitrationStats>;
    } catch (error) {
      console.error('Could not connect to server:', error);

      return errorResponse('Could not connect to the server.');
    }
  }

  // Hämta historik
  static async getHistory(userToken: string): Promise<ApiResponse<CalorieHistoryResult>> {
    try {
      const response = await fetch(`${API_URL}/history`, {
        method: 'GET',
        headers: {
          Cookie: `token=${userToken}`,
        },
      });

      return (await response.json()) as ApiSuccessResponse<CalorieHistoryResult>;
    } catch (error) {
      console.error('Could not connect to server:', error);

      return errorResponse('Could not connect to the server.');
    }
  }

  // Hämta näringsmål
  static async getCalorieGoal(userToken: string): Promise<ApiResponse<NutritionGoal>> {
    try {
      const response = await fetch(`${API_URL}/goal`, {
        method: 'GET',
        headers: {
          Cookie: `token=${userToken}`,
        },
      });

      return (await response.json()) as ApiSuccessResponse<NutritionGoal>;
    } catch (error) {
      console.error('Could not connect to server:', error);

      return errorResponse('Could not connect to the server.');
    }
  }

  // Uppdatera näringsmål
  static async updateCalorieGoal(data: NutritionGoal, userToken: string): Promise<ApiResponse<NutritionGoal>> {
    try {
      const response = await fetch(`${API_URL}/goal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `token=${userToken}`,
        },
        body: JSON.stringify(data),
      });

      return (await response.json()) as ApiSuccessResponse<NutritionGoal>;
    } catch (error) {
      console.error('Could not connect to server:', error);

      return errorResponse('Could not connect to the server.');
    }
  }
}
