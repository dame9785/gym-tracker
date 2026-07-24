'use client';

import { WorkoutSessionSetViewModel } from '@/view-models/workout-session-set-view-model';
import { useState } from 'react';
import { WorkoutSessionService } from '@/services/workout-session-service';

interface WorkoutSessionSetCardProps {
  set: WorkoutSessionSetViewModel;
}

export default function WorkoutSessionSetCard({ set }: WorkoutSessionSetCardProps) {
  const [actualReps, setActualReps] = useState(set.actualReps ?? set.targetReps);
  const [actualWeight, setActualWeight] = useState(set.actualWeight ?? set.targetWeight ?? 0);

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const workoutSessionService = new WorkoutSessionService();

  const handleSave = async () => {
    setIsSaving(true);
    setIsSaved(false);

    try {
      const result = await workoutSessionService.updateSet(set.id, actualReps, actualWeight);

      if (result.success) {
        setIsSaved(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800 p-3">
      <span className="font-medium">Set {set.setNumber}</span>

      <div className="flex items-center gap-3">
        <span className="text-zinc-400">
          {set.targetReps} reps × {set.targetWeight} kg
        </span>

        <div>
          <label className="mb-1 block text-xs text-zinc-400">Reps</label>
          <input
            type="number"
            value={actualReps}
            onChange={(e) => {
              setActualReps(Number(e.target.value));
              setIsSaved(false);
            }}
            className="w-20 rounded border border-zinc-600 bg-zinc-900 px-2 py-1"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-zinc-400">Vikt</label>
          <input
            type="number"
            value={actualWeight}
            onChange={(e) => {
              setActualWeight(Number(e.target.value));
              setIsSaved(false);
            }}
            className="w-20 rounded border border-zinc-600 bg-zinc-900 px-2 py-1"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded bg-green-600 px-3 py-1 text-sm font-medium hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? 'Sparar...' : isSaved ? '✔ Sparad' : 'Spara'}
        </button>
      </div>
    </div>
  );
}
