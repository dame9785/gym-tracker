import { ProgressRepository } from '@/repositories/progress-repository';

import type { ExerciseProgress, ProgressApiResponse } from '@/types/progress-type';

export default class ProgressService {
  private readonly progressRepository = new ProgressRepository();

  async getProgress(userId: number): Promise<ProgressApiResponse> {
    const [weightProgress, exerciseSessions] = await Promise.all([this.progressRepository.getWeightProgress(userId), this.progressRepository.getExerciseProgress(userId)]);

    const exerciseMap = new Map<number, ExerciseProgress>();

    for (const session of exerciseSessions) {
      if (session.finishedAt === null) {
        continue;
      }

      const loggedAt = session.finishedAt.toISOString();

      for (const sessionExercise of session.exercises) {
        const exercise = sessionExercise.workoutExercise.exercise;

        let exerciseProgress = exerciseMap.get(exercise.id);

        if (!exerciseProgress) {
          exerciseProgress = {
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            equipment: exercise.equipment,
            history: [],
          };

          exerciseMap.set(exercise.id, exerciseProgress);
        }

        const isPlank = /plank/i.test(exercise.name);

        for (const set of sessionExercise.sets) {
          if (isPlank) {
            exerciseProgress.history.push({
              weight: set.actualWeight ?? 0,
              reps: set.actualReps ?? 0,
              seconds: set.actualSeconds ?? 0,
              loggedAt,
            });

            continue;
          }

          if (set.actualWeight !== null && set.actualReps !== null) {
            exerciseProgress.history.push({
              weight: set.actualWeight,
              reps: set.actualReps,
              seconds: set.actualSeconds ?? 0,
              loggedAt,
            });
          }
        }
      }
    }

    return {
      weightProgress,
      exerciseProgress: Array.from(exerciseMap.values()),
    };
  }
}
