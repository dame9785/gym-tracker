//Next Redirect
import {
  ApiResponse,
  ApiSuccessResponse,
  UpdateWorkoutSessionResponse,
  WorkoutFinishApiResponse,
  WorkoutSessionCreateResponse,
  WorkoutSessionDetailApiResponse,
  WorkoutSessionUpdatedSetResponse,
} from '@/types/api-types';
import { errorResponse } from '@/utils/api-error';

//API URL
const API_URL = 'http://localhost:3000/api/workout-sessions';

export default class WorkoutSessionService {
  //GET: Session By Id
  static async getById(id: number): Promise<ApiResponse<WorkoutSessionDetailApiResponse>> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        return errorResponse('Gick inte hämta data');
      }

      const result = await response.json();
      return result as ApiSuccessResponse<WorkoutSessionDetailApiResponse>;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
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

      if (!response.ok) {
        return errorResponse('Gick inte hämta data');
      }

      const result = await response.json();
      return result as ApiSuccessResponse<WorkoutSessionCreateResponse>;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
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

      if (!response.ok) {
        return errorResponse('Gick inte hämta data');
      }

      const result = await response.json();
      return result as ApiSuccessResponse<WorkoutSessionUpdatedSetResponse>;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }

  //PUT: Finish session
  static async finish(sessionId: number): Promise<ApiResponse<WorkoutFinishApiResponse>> {
    try {
      const response = await fetch(`${API_URL}/${sessionId}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        return errorResponse('Gick inte hämta data');
      }

      const result = await response.json();
      return result as ApiSuccessResponse<WorkoutFinishApiResponse>;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }

  //Set workoutSession to not performed
  static async setNotPerformed(workoutSessionId: number): Promise<ApiResponse<UpdateWorkoutSessionResponse>> {
    try {
      const response = await fetch(`${API_URL}/${workoutSessionId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return errorResponse('Gick inte hämta data');
      }

      const result = await response.json();
      return result as ApiSuccessResponse<UpdateWorkoutSessionResponse>;
    } catch (error) {
      console.log(error);
      return errorResponse('Servern  kunde inte ansluta');
    }
  }
}
