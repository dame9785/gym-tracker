import { ApiResponse, DashboardApiResponse } from '@/types/api-types';

//API URL
const API_URL = 'http://localhost:3000/api/dashboard';

//Utils
import { errorResponse } from '@/utils/api-error';

export default class DashboardService {
  static async getDashboard(token: string): Promise<ApiResponse<DashboardApiResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
        headers: {
          Cookie: `token=${token}`,
        },
      });

      const result = (await response.json()) as ApiResponse<DashboardApiResponse>;
      return result;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }
}
