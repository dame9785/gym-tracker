import { ProgressRepository } from '@/repositories/progress-repository';
import { type ApiResponse, type ErrorResponse, type SuccessResponse } from '@/types/api-types';
import type { ExerciseProgress, ProgressApiResponse } from '@/types/progress-type';

export default class ProgressService {
  private progressRepository = new ProgressRepository();

  async getProgress(userId: number): Promise<ApiResponse<ProgressApiResponse>> {
    try {
      const weightProgress = await this.progressRepository.getWeightProgress(userId);

      const exerciseSessions = await this.progressRepository.getExerciseProgress(userId);

      const exerciseMap = new Map<number, ExerciseProgress>();

      for (const session of exerciseSessions) {
        for (const sessionExercise of session.exercises) {
          const exercise = sessionExercise.workoutExercise.exercise;

          if (!exerciseMap.has(exercise.id)) {
            exerciseMap.set(exercise.id, {
              exerciseId: exercise.id,
              exerciseName: exercise.name,
              history: [],
            });
          }

          const exerciseProgress = exerciseMap.get(exercise.id)!;

          for (const set of sessionExercise.sets) {
            if (set.actualWeight !== null && set.actualReps !== null && session.finishedAt !== null) {
              exerciseProgress.history.push({
                weight: set.actualWeight,
                reps: set.actualReps,
                loggedAt: session.finishedAt.toISOString(),
              });
            }
          }
        }
      }

      return {
        success: true,
        data: {
          weightProgress,
          exerciseProgress: Array.from(exerciseMap.values()),
        },
      } satisfies SuccessResponse<ProgressApiResponse>;
    } catch (error) {
      console.error('Failed to load progress:', error);

      return {
        success: false,
        message: 'Kunde inte hämta träningsprogress.',
      } satisfies ErrorResponse;
    }
  }
}
