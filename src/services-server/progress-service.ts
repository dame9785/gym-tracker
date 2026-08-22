import { ProgressRepository } from '@/repositories/progress-repository';
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse } from '@/types/api-types';
import { ExerciseProgress, ProgressApiResponse } from '@/types/progress-type';

export class ProgressService {
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

      const exerciseProgress = Array.from(exerciseMap.values());

      return {
        success: true,
        data: {
          weightProgress,
          exerciseProgress,
        },
      } satisfies ApiSuccessResponse<ProgressApiResponse>;
    } catch (error) {
      console.log('ERROR', error);

      return {
        success: false,
        message: 'Server fel, gick ej hämta progress data',
      } satisfies ApiErrorResponse;
    }
  }
}
