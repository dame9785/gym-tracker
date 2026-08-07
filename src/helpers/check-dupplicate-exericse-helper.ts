import { prisma } from '@/lib/prisma';
import { Exercise } from '@/types/exercise-types';
/**
 * Checks if the exercise list contains duplicate exercise IDs.
 *
 * @param exercises The exercises to check.
 * @returns True if duplicates are found; otherwise, false.
 */
export function hasDuplicateExercises<T extends Exercise>(exercises: T[]): boolean {
  const ids = exercises.map((x) => x.exerciseId);

  return new Set(ids).size !== ids.length;
}
