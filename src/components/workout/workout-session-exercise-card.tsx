import type { WorkoutSessionExerciseViewModel } from '@/types/exercise-types';

import WorkoutSessionSetCard from '@/components/workout/workout-session-set-card';

interface WorkoutSessionExerciseCardProps {
  exercise: WorkoutSessionExerciseViewModel;
}

export default function WorkoutSessionExerciseCard({ exercise }: WorkoutSessionExerciseCardProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-white sm:text-xl">{exercise.name}</h2>

          <span className="text-sm text-zinc-500">{exercise.sets.length} set</span>
        </div>

        {exercise.primaryMuscle && (
          <p className="mt-1 text-sm text-zinc-400">
            {exercise.primaryMuscle}
            {exercise.secondaryMuscles.length > 0 && ` · ${exercise.secondaryMuscles.join(', ')}`}
          </p>
        )}

        {exercise.note && <p className="mt-3 text-sm text-zinc-400">{exercise.note}</p>}
      </div>

      <div>
        {exercise.sets.map((set) => (
          <WorkoutSessionSetCard key={set.id} set={set} />
        ))}
      </div>
    </section>
  );
}
