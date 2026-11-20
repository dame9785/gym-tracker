import type { WorkoutSessionExerciseViewModel } from '@/types/exercise-types';

import WorkoutSessionSetCard from '@/components/workout/workout-session-set-card';

interface WorkoutSessionExerciseCardProps {
  exercise: WorkoutSessionExerciseViewModel;
}

export default function WorkoutSessionExerciseCard({ exercise }: WorkoutSessionExerciseCardProps) {
  return (
    <section className="border-border bg-surface min-w-0 overflow-hidden rounded-2xl border">
      <div className="border-border border-b p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-text text-lg font-bold sm:text-xl">{exercise.name}</h2>

          <span className="text-text-muted text-sm">{exercise.sets.length} set</span>
        </div>

        {exercise.primaryMuscle && (
          <p className="text-text-secondary mt-1 text-sm">
            {exercise.primaryMuscle}
            {exercise.secondaryMuscles.length > 0 && ` · ${exercise.secondaryMuscles.join(', ')}`}
          </p>
        )}

        {exercise.note && <p className="text-text-secondary mt-3 text-sm">{exercise.note}</p>}
      </div>

      <div>
        {exercise.sets.map((set) => (
          <WorkoutSessionSetCard key={set.id} set={set} />
        ))}
      </div>
    </section>
  );
}
