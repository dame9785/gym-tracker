//Next Redirect
import { ApiErrorResponse, ApiResponse, GoalResponse } from '@/types/api-types';

//API URL
const API_URL = 'http://localhost:3000/api/goals';

export default class GoalTypesService {
  static async getAll(): Promise<ApiResponse<GoalResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
      });

      const result: ApiResponse<GoalResponse> = await response.json();
      return result;
    } catch (error) {
      return { success: false, message: 'Server fel gick inte hämta data' } satisfies ApiErrorResponse;
    }
  }
}
