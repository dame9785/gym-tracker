type Exercise = {
  exerciseId: number;
};

export function hasDuplicateExercises<T extends Exercise>(exercises: T[]): boolean {
  const ids = exercises.map((x) => x.exerciseId);

  return new Set(ids).size !== ids.length;
}
