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
  //POST: Create session
  static async create(workoutId: number): Promise<ApiResponse<WorkoutSessionCreateResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ workoutId }),
      });

      const result = (await response.json()) as ApiResponse<WorkoutSessionCreateResponse>;

      return result;
    } catch (error) {
      return errorResponse('Gick inte att hämta data');
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
        credentials: 'include',
        body: JSON.stringify({
          actualReps,
          actualWeight,
        }),
      });

      const result = (await response.json()) as ApiResponse<WorkoutSessionUpdatedSetResponse>;

      return result;
    } catch (error) {
      return errorResponse('Gick inte att hämta data');
    }
  }

  //PUT: Finish session
  static async finish(sessionId: number): Promise<ApiResponse<WorkoutFinishApiResponse>> {
    try {
      const response = await fetch(`${API_URL}/${sessionId}`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (!response.ok) {
        return errorResponse('Gick inte hämta data');
      }

      const result = (await response.json()) as ApiResponse<WorkoutFinishApiResponse>;
      return result;
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
        credentials: 'include',
      });

      const result = (await response.json()) as ApiResponse<UpdateWorkoutSessionResponse>;

      return result;
    } catch (error) {
      return errorResponse('Servern kunde inte ansluta');
    }
  }
}
