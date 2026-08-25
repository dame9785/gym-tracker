//Next Redirect
import { ApiResponse, HistoryApiResponse } from '@/types/api-types';
import { errorResponse } from '@/utils/api-error';

//API URL
const API_URL = 'http://localhost:3000/api/history';

export default class HistoryService {
  static async getHistory(token: string, page: number): Promise<ApiResponse<HistoryApiResponse>> {
    try {
      const response = await fetch(`${API_URL}?page=${page}`, {
        method: 'GET',
        headers: {
          Cookie: `token=${token}`,
        },
      });

      const result = (await response.json()) as ApiResponse<HistoryApiResponse>;
      return result;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }
}
