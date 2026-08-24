import { WorkoutSessionMapper } from '@/mapping/workout-session-mapping';
import { WorkoutSessionRepository } from '@/repositories/workout-session-repository';
import {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
  UpdateWorkoutSessionResponse,
  WorkoutFinishApiResponse,
  WorkoutSessionCreateResponse,
  WorkoutSessionDetailApiResponse,
  WorkoutSessionUpdatedSetResponse,
} from '@/types/api-types';

export class WorkoutSessionService {
  private workoutSessionRepository = new WorkoutSessionRepository();

  async create(workoutId: number, userId: number): Promise<ApiResponse<WorkoutSessionCreateResponse>> {
    try {
      const workoutSession = await this.workoutSessionRepository.create(workoutId, userId);

      return {
        success: true,
        data: workoutSession.id,
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
        data: WorkoutSessionMapper.mapWorkoutSession(workoutSession),
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
        data: updatedSet,
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
        data: workoutSession,
      } satisfies ApiSuccessResponse<WorkoutFinishApiResponse>;
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: 'Kunde inte avsluta träningspasset.',
      } satisfies ApiErrorResponse;
    }
  }

  //Update workout session status
  async updateWorkoutSessionStatus(workoutSessionId: number): Promise<ApiResponse<UpdateWorkoutSessionResponse>> {
    console.log('WORKOUTID', workoutSessionId);
    try {
      // const [workoutSession, updatedWorkoutSession] = await Promise.all([
      //   this.workoutSessionRepository.create(workoutId, userId),
      //   this.workoutSessionRepository.updateWorkoutSessionsStatus(workoutId),
      // ]);

      const updatedWorkoutSession = await this.workoutSessionRepository.updateWorkoutSessionsStatus(workoutSessionId);
      console.log('sessions:', updatedWorkoutSession);

      if (!updatedWorkoutSession) {
        return {
          success: false,
          message: 'Kunde inte avsluta träningspasset.',
        } satisfies ApiErrorResponse;
      }
      return {
        success: true,
        data: {
          success: true,
          message: 'Status updated',
        },
      } satisfies ApiSuccessResponse<UpdateWorkoutSessionResponse>;
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: 'Kunde inte avsluta träningspasset.',
      } satisfies ApiErrorResponse;
    }
  }
}
