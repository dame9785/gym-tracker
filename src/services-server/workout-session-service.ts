import { WorkoutSessionMapper } from '@/mapping/workout-session-mapping';
import { WorkoutSessionRepository } from '@/repositories/workout-session-repository';
import {
  ErrorResponse,
  ApiResponse,
  SuccessResponse,
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
      } satisfies SuccessResponse<WorkoutSessionCreateResponse>;
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: 'Kunde inte skapa träningspasset.',
      } satisfies ErrorResponse;
    }
  }

  async getById(id: number, userId: number): Promise<ApiResponse<WorkoutSessionDetailApiResponse>> {
    try {
      const workoutSession = await this.workoutSessionRepository.getById(id, userId);

      if (!workoutSession) {
        return {
          success: false,
          message: 'Träningspasset hittades inte eller saknar behörighet.',
        } satisfies ErrorResponse;
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
  async updateSet(id: number, actualReps: number, actualWeight: number, actualSeconds: number, userId: number): Promise<ApiResponse<WorkoutSessionUpdatedSetResponse>> {
    try {
      const updatedSet = await this.workoutSessionRepository.updateSet(id, actualReps, actualWeight, actualSeconds, userId);

      if (!updatedSet) {
        return {
          success: false,
          message: 'Setet hittades inte eller saknar behörighet.',
        } satisfies ErrorResponse;
      }

      return {
        success: true,
        data: updatedSet,
      } satisfies SuccessResponse<WorkoutSessionUpdatedSetResponse>;
    } catch (error) {
      console.error('Failed to update workout session set:', error);

      return {
        success: false,
        message: 'Gick inte att uppdatera setet.',
      } satisfies ErrorResponse;
    }
  }

  async finish(id: number, userId: number): Promise<ApiResponse<WorkoutFinishApiResponse>> {
    try {
      const workoutSession = await this.workoutSessionRepository.finish(id, userId);

      if (!workoutSession) {
        return {
          success: false,
          message: 'Träningspasset hittades inte eller saknar behörighet.',
        } satisfies ErrorResponse;
      }

      return {
        success: true,
        data: workoutSession,
      } satisfies SuccessResponse<WorkoutFinishApiResponse>;
    } catch (error) {
      console.error('Failed to finish workout session:', error);

      return {
        success: false,
        message: 'Kunde inte avsluta träningspasset.',
      } satisfies ErrorResponse;
    }
  }

  //Update workout session status
  async updateWorkoutSessionStatus(workoutSessionId: number, userId: number): Promise<ApiResponse<UpdateWorkoutSessionResponse>> {
    try {
      const updated = await this.workoutSessionRepository.updateWorkoutSessionsStatus(workoutSessionId, userId);

      if (!updated) {
        return {
          success: false,
          message: 'Träningspasset hittades inte eller saknar behörighet.',
        } satisfies ErrorResponse;
      }

      return {
        success: true,
        data: {
          success: true,
          message: 'Status updated',
        },
      } satisfies SuccessResponse<UpdateWorkoutSessionResponse>;
    } catch (error) {
      console.error('Failed to update workout session status:', error);

      return {
        success: false,
        message: 'Kunde inte uppdatera träningspassets status.',
      } satisfies ErrorResponse;
    }
  }

  async getLatestCompletedByWorkoutId(workoutId: number, userId: number) {
    try {
      const session = await this.workoutSessionRepository.getLatestCompletedByWorkoutId(workoutId, userId);

      if (!session) {
        return {
          success: true as const,
          data: null,
        };
      }

      return {
        success: true as const,
        data: WorkoutSessionMapper.mapWorkoutSession(session),
      };
    } catch (error) {
      console.error(error);

      return {
        success: false as const,
        message: 'Kunde inte hämta den senaste avslutade träningssessionen.',
      };
    }
  }

  async getPreviousCompletedByWorkoutId(workoutId: number, userId: number, currentSessionId: number) {
    try {
      const session = await this.workoutSessionRepository.getPreviousCompletedByWorkoutId(workoutId, userId, currentSessionId);

      if (!session) {
        return {
          success: true as const,
          data: null,
        };
      }

      return {
        success: true as const,
        data: WorkoutSessionMapper.mapWorkoutSession(session),
      };
    } catch (error) {
      console.error(error);

      return {
        success: false as const,
        message: 'Kunde inte hämta föregående träningspass.',
      };
    }
  }

  async getPreviousCompletedSessions(userId: number, currentSessionId: number, currentFinishedAt: Date) {
    try {
      const sessions = await this.workoutSessionRepository.getPreviousCompletedSessions(userId, currentSessionId, currentFinishedAt);

      return {
        success: true as const,
        data: sessions.map((session) => WorkoutSessionMapper.mapWorkoutSession(session)),
      };
    } catch (error) {
      console.error('Failed to fetch previous completed sessions:', error);

      return {
        success: false as const,
        message: 'Kunde inte hämta tidigare träningspass.',
      };
    }
  }
}
