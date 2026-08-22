import { ApiErrorResponse, ApiResponse, DashboardApiResponse } from '@/types/api-types';

//API URL
const API_URL = 'http://localhost:3000/api/dashboard';

export default class DashboardService {
  static async getDashboard(token: string): Promise<ApiResponse<DashboardApiResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
        headers: {
          Cookie: `token=${token}`,
        },
      });

      const result = await response.json();
      return result as ApiResponse<DashboardApiResponse>;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
    }
  }
}
