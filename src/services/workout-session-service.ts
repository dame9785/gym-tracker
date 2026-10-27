import { ApiResponse, UpdateWorkoutSessionResponse, WorkoutFinishApiResponse, WorkoutSessionCreateResponse, WorkoutSessionUpdatedSetResponse } from '@/types/api-types';
import { errorResponse } from '@/utils/api-error';

// API URL – fungerar både lokalt och på Vercel
const API_URL = '/api/workout-sessions';

export default class WorkoutSessionService {
  // POST: Create session
  static async create(workoutId: number): Promise<ApiResponse<WorkoutSessionCreateResponse>> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ workoutId }),
      });

      const result = (await response.json()) as ApiResponse<WorkoutSessionCreateResponse>;

      return result;
    } catch {
      return errorResponse('Gick inte att hämta data');
    }
  }

  // PUT: Update session set
  static async updateSet(id: number, actualReps: number, actualWeight: number, actualSeconds: number): Promise<ApiResponse<WorkoutSessionUpdatedSetResponse>> {
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
          actualSeconds,
        }),
      });

      const result = (await response.json()) as ApiResponse<WorkoutSessionUpdatedSetResponse>;

      return result;
    } catch {
      return errorResponse('Gick inte att hämta data');
    }
  }

  // PUT: Finish session
  static async finish(sessionId: number): Promise<ApiResponse<WorkoutFinishApiResponse>> {
    try {
      const response = await fetch(`${API_URL}/${sessionId}`, {
        method: 'PUT',
        credentials: 'include',
      });

      const result = (await response.json()) as ApiResponse<WorkoutFinishApiResponse>;

      return result;
    } catch {
      return errorResponse('Could not connect to the server');
    }
  }

  // PUT: Set workout session to not performed
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
    } catch {
      return errorResponse('Servern kunde inte ansluta');
    }
  }
}
