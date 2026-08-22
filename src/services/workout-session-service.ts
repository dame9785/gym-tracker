//Next Redirect
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse, WorkoutFinishApiResponse, WorkoutSessionCreateResponse, WorkoutSessionDetailApiResponse, WorkoutSessionUpdatedSetResponse } from '@/types/api-types';

//API URL
const API_URL = 'http://localhost:3000/api/workout-sessions';

export default class WorkoutSessionService {
  //GET: Session By Id
  static async getById(id: number): Promise<ApiResponse<WorkoutSessionDetailApiResponse>> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
      });

      const result = await response.json();
      return result as ApiSuccessResponse<WorkoutSessionDetailApiResponse>;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
    }
  }

  //POST: Create session
  static async create(workoutId: number, userToken: string): Promise<ApiResponse<WorkoutSessionCreateResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `token=${userToken}`,
        },
        body: JSON.stringify({
          workoutId,
        }),
      });

      const result = await response.json();
      return result as ApiSuccessResponse<WorkoutSessionCreateResponse>;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
    }
  }

  //PUT: Update session
  static async updateSet(id: number, actualReps: number, actualWeight: number): Promise<ApiResponse<WorkoutSessionUpdatedSetResponse>> {
    try {
      const response = await fetch(`/api/workout-session-sets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actualReps,
          actualWeight,
        }),
      });

      const result = await response.json();
      return result as ApiSuccessResponse<WorkoutSessionUpdatedSetResponse>;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
    }
  }

  //PUT: Finish session
  static async finish(sessionId: number): Promise<ApiResponse<WorkoutFinishApiResponse>> {
    try {
      const response = await fetch(`${API_URL}/${sessionId}`, {
        method: 'PUT',
      });

      const result = await response.json();
      return result as ApiSuccessResponse<WorkoutFinishApiResponse>;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
    }
  }
}
