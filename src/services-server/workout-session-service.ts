import { WorkoutSessionMapper } from '@/mapping/workout-session-mapping';
import { WorkoutSessionRepository } from '@/repositories/workout-session-repository';
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse, WorkoutFinishApiResponse, WorkoutSessionCreateResponse, WorkoutSessionDetailApiResponse, WorkoutSessionUpdatedSetResponse } from '@/types/api-types';

export class WorkoutSessionService {
  private workoutSessionRepository = new WorkoutSessionRepository();

  async create(workoutId: number, userId: number): Promise<ApiResponse<WorkoutSessionCreateResponse>> {
    try {
      const workoutSession = await this.workoutSessionRepository.create(workoutId, userId);

      return {
        success: true,
        data: {
          workoutSessionId: workoutSession.id,
        },
      } satisfies ApiSuccessResponse<WorkoutSessionCreateResponse>;
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: 'Kunde inte skapa träningspasset.',
      } satisfies ApiErrorResponse;
    }
  }

  async getById(id: number): Promise<ApiResponse<WorkoutSessionDetailApiResponse>> {
    try {
      const workoutSession = await this.workoutSessionRepository.getById(id);
      if (!workoutSession) {
        return {
          success: false,
          message: 'Kunde inte avsluta träningspasset.',
        } satisfies ApiErrorResponse;
      }

      return {
        success: true,
        data: {
          workoutSession: WorkoutSessionMapper.mapWorkoutSession(workoutSession),
        },
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: 'Kunde inte hämta träningspasset.',
      };
    }
  }
  async updateSet(id: number, actualReps: number, actualWeight: number): Promise<ApiResponse<WorkoutSessionUpdatedSetResponse>> {
    try {
      const updatedSet = await this.workoutSessionRepository.updateSet(id, actualReps, actualWeight);
      if (!updatedSet) {
        return {
          success: false,
          message: 'Gick inte uppdatera, server fel',
        } satisfies ApiErrorResponse;
      }

      return {
        success: true,
        data: {
          updatedSet: updatedSet,
        },
      } satisfies ApiSuccessResponse<WorkoutSessionUpdatedSetResponse>;
    } catch (error) {
      console.log('ERROR', error);
      return {
        success: false,
        message: 'Gick inte uppdatera, server fel',
      } satisfies ApiErrorResponse;
    }
  }

  async finish(id: number): Promise<ApiResponse<WorkoutFinishApiResponse>> {
    try {
      const workoutSession = await this.workoutSessionRepository.finish(id);
      return {
        success: true,
        data: {
          workoutSession: workoutSession,
        },
      } satisfies ApiSuccessResponse<WorkoutFinishApiResponse>;
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: 'Kunde inte avsluta träningspasset.',
      } satisfies ApiErrorResponse;
    }
  }
}
