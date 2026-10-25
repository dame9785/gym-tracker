'use client';

import { Dumbbell } from 'lucide-react';
import type { ExerciseViewModel } from '@/types/exercise-types';

import ExericseCard from '@/components/exericse/exercise-card';

type Props = {
  exercises: ExerciseViewModel[];
};

export default function Exercises({ exercises }: Props) {
  if (exercises.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-white">No exercises yet</h2>

        <p className="mt-2 text-sm text-zinc-400">Add your first exercise to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {exercises.map((exercise) => (
        <ExericseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
}
