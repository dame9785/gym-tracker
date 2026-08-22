import { ApiResponse, ApiSuccessResponse } from '@/types/api-types';
import { ProgressApiResponse } from '@/types/progress-type';

//Utils
import { errorResponse } from '@/utils/api-error-response';

const API_URL = 'http://localhost:3000/api/progress';

export default class ProgressService {
  static async getProgress(userToken: string): Promise<ApiResponse<ProgressApiResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
        headers: {
          Cookie: `token=${userToken}`,
        },
      });

      if (!response.ok) {
        return errorResponse('Gick inte hämta data');
      }

      const result = await response.json();
      return result as ApiSuccessResponse<ProgressApiResponse>;
    } catch (error) {
      return errorResponse('Kunde inte ansluta till servern');
    }
  }
}
