//Next Redirect
import type { ApiResponse } from '@/types/api-types';
import type { GoalApiResponse } from '@/types/goal-types';

//API URL
const API_URL = 'http://localhost:3000/api/goals';

import { errorResponse } from '@/utils/api-responses';

export default class GoalTypesService {
  static async getAll(): Promise<ApiResponse<GoalApiResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
      });

      if (!response.ok) {
        return errorResponse('Gick inte hämta data');
      }

      const result = (await response.json()) as ApiResponse<GoalApiResponse>;
      return result;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }
}
