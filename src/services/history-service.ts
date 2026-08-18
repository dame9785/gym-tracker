//Next Redirect
import { ApiErrorResponse, ApiResponse, HistoryApiResponse } from '@/types/api-types';

//API URL
const API_URL = 'http://localhost:3000/api/history';

export default class HistoryService {
  static async getHistory(userId: number): Promise<ApiResponse<HistoryApiResponse>> {
    try {
      const response = await fetch(`${API_URL}/${userId}`);
      const result = await response.json();

      return result as ApiResponse<HistoryApiResponse>;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
    }
  }
}
