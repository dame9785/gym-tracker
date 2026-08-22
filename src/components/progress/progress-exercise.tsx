'use client';

import { useState } from 'react';
import { Dumbbell } from 'lucide-react';

import type { ExerciseProgress as ExerciseProgressType } from '@/types/progress-type';

import ExerciseChart from './progress-exercise-chart';

type Props = {
  exerciseProgress: ExerciseProgressType[];
};

export default function ExerciseProgress({ exerciseProgress }: Props) {
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(exerciseProgress[0]?.exerciseId ?? null);

  const selectedExercise = exerciseProgress.find((exercise) => exercise.exerciseId === selectedExerciseId);

  const history = selectedExercise?.history ?? [];

  const current = history.at(-1);

  const bestWeight = history.reduce((best, entry) => Math.max(best, entry.weight), 0);

  const start = history[0];

  const calculateEstimatedOneRepMax = (weight: number, reps: number) => {
    return weight * (1 + reps / 30);
  };

  const startOneRepMax = start ? calculateEstimatedOneRepMax(start.weight, start.reps) : 0;

  const currentOneRepMax = current ? calculateEstimatedOneRepMax(current.weight, current.reps) : 0;

  const improvement = startOneRepMax > 0 ? ((currentOneRepMax - startOneRepMax) / startOneRepMax) * 100 : 0;

  return (
    <div className="mb-10 rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-950 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
          <Dumbbell className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-semibold text-white">Exercise progress</h2>

          <p className="text-sm text-zinc-500">Track your strength progression</p>
        </div>
      </div>

      {/* Exercise selector */}
      <div className="mt-6">
        <label htmlFor="exercise" className="mb-2 block text-sm font-medium text-zinc-400">
          Exercise
        </label>

        <select
          id="exercise"
          value={selectedExerciseId ?? ''}
          onChange={(event) => setSelectedExerciseId(Number(event.target.value))}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500 sm:max-w-md"
        >
          {exerciseProgress.map((exercise) => (
            <option key={exercise.exerciseId} value={exercise.exerciseId}>
              {exercise.exerciseName}
            </option>
          ))}
        </select>
      </div>

      {/* Selected exercise */}
      {selectedExercise && (
        <>
          {/* Exercise name */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-white">{selectedExercise.exerciseName}</h3>
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Current */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">Current</p>

              <p className="mt-2 text-2xl font-bold text-white">
                {current?.weight ?? 0}
                <span className="ml-1 text-sm font-medium text-zinc-500">kg</span>
              </p>

              {current && <p className="mt-1 text-xs text-zinc-500">{current.reps} reps</p>}
            </div>

            {/* Personal best */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">Best</p>

              <p className="mt-2 text-2xl font-bold text-purple-400">
                {bestWeight.toFixed(1)}
                <span className="ml-1 text-sm font-medium text-zinc-500">kg</span>
              </p>

              <p className="mt-1 text-xs text-zinc-500">Highest weight</p>
            </div>

            {/* Improvement */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">Improvement</p>

              <p className={`mt-2 text-2xl font-bold ${improvement >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {improvement > 0 ? '+' : ''}
                {improvement.toFixed(1)}
                <span className="ml-1 text-sm font-medium text-zinc-500">%</span>
              </p>

              <p className="mt-1 text-xs text-zinc-500">Since first recorded set</p>
            </div>
          </div>

          {/* Strength chart */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white">Strength progression</h3>

            <p className="text-sm text-zinc-500">Your weight progression over time</p>

            <ExerciseChart history={selectedExercise.history} />
          </div>

          {/* History */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white">History</h3>

            <div className="mt-4 space-y-3">
              {selectedExercise.history.map((entry, index) => (
                <div key={`${entry.loggedAt}-${index}`} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
                  <div>
                    <p className="font-medium text-white">
                      {entry.weight} kg × {entry.reps}
                    </p>

                    <p className="text-xs text-zinc-500">{new Date(entry.loggedAt).toLocaleDateString('sv-SE')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* No data */}
      {exerciseProgress.length === 0 && <p className="mt-6 text-sm text-zinc-500">No exercise progress available yet.</p>}
    </div>
  );
}
