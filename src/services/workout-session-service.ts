//Next Redirect
import {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
  WorkoutFinishApiResponse,
  WorkoutSessionCreateResponse,
} from '@/types/api-types';
import { redirect } from 'next/navigation';

//API URL
const API_URL = 'http://localhost:3000/api/workout-sessions';

export default class WorkoutSessionService {
  //GET Session By Id
  static async getById(id: number) {
    try {
      const response = await fetch(`/api/workout-sessions/${id}`);
      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }

  //POST: Create session
  static async create(workoutId: number): Promise<ApiResponse<WorkoutSessionCreateResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workoutId,
        }),
      });

      const result = await response.json();
      return result as ApiResponse<WorkoutSessionCreateResponse>;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
    }
  }

  //PUT: Update session
  static async updateSet(id: number, actualReps: number, actualWeight: number) {
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

      return await response.json();
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
