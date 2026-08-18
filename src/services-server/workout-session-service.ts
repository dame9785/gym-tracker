import { mapWorkoutSession } from '@/mapping/workout-session-mapping';
import { WorkoutSessionRepository } from '@/repositories/workout-session-repository';
import {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
  WorkoutFinishApiResponse,
  WorkoutSessionCreateResponse,
} from '@/types/api-types';

export class WorkoutSessionService {
  private workoutSessionRepository = new WorkoutSessionRepository();

  async create(userId: number, workoutId: number): Promise<ApiResponse<WorkoutSessionCreateResponse>> {
    try {
      const workoutSession = await this.workoutSessionRepository.create(userId, workoutId);

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

  async getById(id: number) {
    try {
      const workoutSession = await this.workoutSessionRepository.getById(id);

      if (!workoutSession) {
        return {
          success: false,
          message: 'Träningspasset hittades inte.',
        };
      }

      return {
        success: true,
        workoutSession: mapWorkoutSession(workoutSession),
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: 'Kunde inte hämta träningspasset.',
      };
    }
  }
  async updateSet(id: number, actualReps: number, actualWeight: number) {
    const updatedSet = await this.workoutSessionRepository.updateSet(id, actualReps, actualWeight);

    return {
      success: true,
      workoutSessionSet: updatedSet,
    };
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
