//Next Redirect
import { ApiResponse, GoalResponse } from '@/types/api-types';

//API URL
const API_URL = 'http://localhost:3000/api/goals';

import { errorResponse } from '@/utils/api-responses';

export default class GoalTypesService {
  static async getAll(): Promise<ApiResponse<GoalResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
      });

      if (!response.ok) {
        return errorResponse('Gick inte hämta data');
      }

      const result: ApiResponse<GoalResponse> = await response.json();
      return result;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }
}
