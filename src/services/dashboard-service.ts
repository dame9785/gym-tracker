//Repository
import { DashboardRepository } from '@/repositories/dashboard-repository';
import { ApiErrorResponse, ApiResponse, DashboardApiResponse } from '@/types/api-types';

//Types
import type { DashboardResponse } from '@/types/dashboard-types';

//NEXT Redirect
import { redirect } from 'next/navigation';

//API URL
const API_URL = 'http://localhost:3000/api/dashboard';

export class DashboardService {
  private dashboardRepository = new DashboardRepository();

  async getDashboard(): Promise<ApiResponse<DashboardApiResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
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
