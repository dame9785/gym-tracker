'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import type { WorkoutSessionSetViewModel } from '@/types/workout-types';

interface WorkoutSessionSetCardProps {
  set: WorkoutSessionSetViewModel;
}

export default function WorkoutSessionSetCard({ set }: WorkoutSessionSetCardProps) {
  const [actualReps, setActualReps] = useState(set.actualReps ?? set.targetReps);
  const [actualSeconds, setActualSeconds] = useState(set.actualSeconds ?? set.targetSeconds ?? 0);
  const [actualWeight, setActualWeight] = useState(set.actualWeight ?? set.targetWeight ?? 0);

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(set.completed);

  const handleSave = async () => {
    if (isSaving) return;

    if (
      !Number.isFinite(actualReps) ||
      !Number.isInteger(actualReps) ||
      actualReps < 0 ||
      !Number.isFinite(actualWeight) ||
      actualWeight < 0 ||
      !Number.isFinite(actualSeconds) ||
      actualSeconds < 0
    ) {
      toast.error('Enter valid, non-negative values.');
      return;
    }

    setIsSaving(true);
    setIsSaved(false);

    try {
      const response = await fetch(`/api/workout-session-sets/${set.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actualReps,
          actualWeight,
          actualSeconds,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(result.message ?? 'Could not save set. Please try again.');
        return;
      }

      toast.success('Set saved!');
      setIsSaved(true);
    } catch (error) {
      console.error('Failed to save workout set:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`border-t px-4 py-4 transition first:border-t-0 ${isSaved ? 'bg-green-500/[0.02]' : 'bg-transparent'}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        {/* Set information */}
        <div className="flex min-w-[170px] items-center gap-3 lg:pb-2">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
              isSaved ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'
            }`}
          >
            {set.setNumber}
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Set {set.setNumber}</p>

            <p className="text-xs text-zinc-500">
              Target: {set.targetReps} reps
              {set.targetWeight !== null && ` • ${set.targetWeight} kg`}
              {set.targetSeconds !== null && ` • ${set.targetSeconds} sec`}
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid flex-1 grid-cols-3 gap-3">
          <div>
            <label htmlFor={`reps-${set.id}`} className="mb-1.5 block text-xs font-medium text-zinc-500">
              Reps
            </label>

            <input
              id={`reps-${set.id}`}
              type="number"
              min="0"
              step="1"
              value={actualReps}
              onChange={(event) => {
                setActualReps(Number(event.target.value));
                setIsSaved(false);
              }}
              className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label htmlFor={`weight-${set.id}`} className="mb-1.5 block text-xs font-medium text-zinc-500">
              Weight (kg)
            </label>

            <input
              id={`weight-${set.id}`}
              type="number"
              min="0"
              step="0.5"
              value={actualWeight}
              onChange={(event) => {
                setActualWeight(Number(event.target.value));
                setIsSaved(false);
              }}
              className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label htmlFor={`seconds-${set.id}`} className="mb-1.5 block text-xs font-medium text-zinc-500">
              Seconds (sec)
            </label>

            <input
              id={`seconds-${set.id}`}
              type="number"
              min="0"
              step="0.1"
              value={actualSeconds}
              onChange={(event) => {
                setActualSeconds(Number(event.target.value));
                setIsSaved(false);
              }}
              className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
        </div>

        {/* Save */}
        <div className="lg:pb-0">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`h-10 w-full cursor-pointer rounded-lg px-5 text-sm font-semibold transition lg:w-auto ${
              isSaved ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-blue-600 text-white hover:bg-blue-500'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isSaving ? 'Saving...' : isSaved ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
