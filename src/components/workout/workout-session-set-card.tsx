'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { updateWorkoutSessionSetAction } from '@/actions/workout-session-actions';
import type { WorkoutSessionSetViewModel } from '@/types/exercise-types';

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

    if (!Number.isFinite(actualReps) || !Number.isInteger(actualReps) || actualReps < 0 || !Number.isFinite(actualWeight) || actualWeight < 0 || !Number.isFinite(actualSeconds) || actualSeconds < 0) {
      toast.error('Enter valid, non-negative values.');
      return;
    }

    setIsSaving(true);
    setIsSaved(false);

    try {
      const result = await updateWorkoutSessionSetAction(set.id, {
        actualReps,
        actualWeight,
        actualSeconds,
      });

      if (!result.success) {
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
    <div className={`border-border border-t px-4 py-4 transition first:border-t-0 ${isSaved ? 'bg-success/5' : 'bg-transparent'}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex min-w-[170px] items-center gap-3 lg:pb-2">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${isSaved ? 'bg-success/10 text-success' : 'bg-info/10 text-info'}`}>{set.setNumber}</div>

          <div>
            <p className="text-text text-sm font-semibold">Set {set.setNumber}</p>

            <p className="text-text-muted text-xs">
              Target: {set.targetReps} reps
              {set.targetWeight !== null && ` • ${set.targetWeight} kg`}
              {set.targetSeconds !== null && ` • ${set.targetSeconds} sec`}
            </p>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-3 gap-3">
          <div>
            <label htmlFor={`reps-${set.id}`} className="text-text-muted mb-1.5 block text-xs font-medium">
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
              className="border-border bg-background text-text focus:border-info focus:ring-info/10 h-10 w-full rounded-lg border px-3 text-sm transition outline-none focus:ring-2"
            />
          </div>

          <div>
            <label htmlFor={`weight-${set.id}`} className="text-text-muted mb-1.5 block text-xs font-medium">
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
              className="border-border bg-background text-text focus:border-info focus:ring-info/10 h-10 w-full rounded-lg border px-3 text-sm transition outline-none focus:ring-2"
            />
          </div>

          <div>
            <label htmlFor={`seconds-${set.id}`} className="text-text-muted mb-1.5 block text-xs font-medium">
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
              className="border-border bg-background text-text focus:border-info focus:ring-info/10 h-10 w-full rounded-lg border px-3 text-sm transition outline-none focus:ring-2"
            />
          </div>
        </div>

        <div className="lg:pb-0">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`h-10 w-full cursor-pointer rounded-lg px-5 text-sm font-semibold transition lg:w-auto ${isSaved ? 'bg-success/10 text-success hover:bg-success/20' : 'bg-info text-text hover:bg-info/80'} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isSaving ? 'Saving...' : isSaved ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
