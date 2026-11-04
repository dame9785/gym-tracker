import { WorkoutSessionMapper } from '@/mapping/workout-session-mapping';
import { WorkoutSessionRepository } from '@/repositories/workout-session-repository';

import type { WorkoutFinishApiResponse, WorkoutSessionDetailApiResponse, WorkoutSessionUpdatedSetResponse } from '@/types/api-types';
export class WorkoutSessionService {
  private workoutSessionRepository = new WorkoutSessionRepository();

  async create(workoutId: number, userId: number): Promise<number> {
    const workoutSession = await this.workoutSessionRepository.create(workoutId, userId);

    return workoutSession.id;
  }

  async getById(id: number, userId: number): Promise<WorkoutSessionDetailApiResponse> {
    const workoutSession = await this.workoutSessionRepository.getById(id, userId);

    if (!workoutSession) {
      throw new Error('The workout session was not found or you do not have permission to access it.');
    }

    return WorkoutSessionMapper.mapWorkoutSession(workoutSession);
  }

  async updateSet(id: number, actualReps: number, actualWeight: number, actualSeconds: number, userId: number): Promise<WorkoutSessionUpdatedSetResponse> {
    const updatedSet = await this.workoutSessionRepository.updateSet(id, actualReps, actualWeight, actualSeconds, userId);

    if (!updatedSet) {
      throw new Error('The set was not found or you do not have permission to update it.');
    }

    return updatedSet;
  }

  async finish(id: number, userId: number): Promise<WorkoutFinishApiResponse> {
    const workoutSession = await this.workoutSessionRepository.finish(id, userId);

    if (!workoutSession) {
      throw new Error('The workout session was not found or you do not have permission to finish it.');
    }

    return workoutSession;
  }

  async updateWorkoutSessionStatus(workoutSessionId: number, userId: number): Promise<void> {
    const updated = await this.workoutSessionRepository.updateWorkoutSessionsStatus(workoutSessionId, userId);

    if (!updated) {
      throw new Error('The workout session was not found or you do not have permission to update its status.');
    }
  }

  async getLatestCompletedByWorkoutId(workoutId: number, userId: number): Promise<WorkoutSessionDetailApiResponse | null> {
    const session = await this.workoutSessionRepository.getLatestCompletedByWorkoutId(workoutId, userId);

    if (!session) {
      return null;
    }

    return WorkoutSessionMapper.mapWorkoutSession(session);
  }

  async getPreviousCompletedByWorkoutId(workoutId: number, userId: number, currentSessionId: number): Promise<WorkoutSessionDetailApiResponse | null> {
    const session = await this.workoutSessionRepository.getPreviousCompletedByWorkoutId(workoutId, userId, currentSessionId);

    if (!session) {
      return null;
    }

    return WorkoutSessionMapper.mapWorkoutSession(session);
  }

  async getPreviousCompletedSessions(userId: number, currentSessionId: number, currentFinishedAt: Date): Promise<WorkoutSessionDetailApiResponse[]> {
    const sessions = await this.workoutSessionRepository.getPreviousCompletedSessions(userId, currentSessionId, currentFinishedAt);

    return sessions.map((session) => WorkoutSessionMapper.mapWorkoutSession(session));
  }
}
