'use client';

import type { WorkoutSessionExerciseViewModel } from '@/types/exercise-types';

import WorkoutSessionSetCard from './workout-session-set-card';

interface WorkoutSessionExerciseCardProps {
  exercise: WorkoutSessionExerciseViewModel;
}

export default function WorkoutSessionExerciseCard({ exercise }: WorkoutSessionExerciseCardProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80">
      {/* Exercise header */}
      <header className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <div>
          <h2 className="text-xl font-bold text-white">
            {exercise.order}. {exercise.name}
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            {exercise.sets.length} {exercise.sets.length === 1 ? 'set' : 'set'}
          </p>
        </div>

        <div className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
          {exercise.sets.length} set
        </div>
      </header>

      {/* Sets */}
      <div>
        {exercise.sets.map((set) => (
          <WorkoutSessionSetCard key={set.id} set={set} />
        ))}
      </div>
    </section>
  );
}
