'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { WorkoutSessionViewModel } from '@/types/workout-types';

import WorkoutSessionExerciseCard from '@/components/workout/workout-session-exercise-card';
import NotPerformedButton from '@/components/dashboard/not-perfomed-button';

interface WorkoutSessionProps {
  workoutSession: WorkoutSessionViewModel;
}

export default function WorkoutSession({ workoutSession }: WorkoutSessionProps) {
  const router = useRouter();
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinishWorkout = async () => {
    if (isFinishing) return;

    const confirmed = window.confirm('Are you sure you want to finish this workout session?');

    if (!confirmed) return;

    setIsFinishing(true);

    try {
      const response = await fetch(`/api/workout-sessions/${workoutSession.id}`, {
        method: 'PUT',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(result.message ?? 'Could not finish workout. Please try again.');
        return;
      }

      toast.success('Workout completed!');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Failed to finish workout:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wider text-blue-400">Workout in progress</p>

        <div className="mt-1 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Workout #{workoutSession.id}</h1>

          <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-400">In progress</span>
        </div>

        <p className="mt-2 text-sm text-zinc-500">Record your actual reps, weights, and seconds for each set.</p>
      </header>

      <div className="space-y-5">
        {workoutSession.exercises.map((exercise) => (
          <WorkoutSessionExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>

      <div className="mt-8 flex justify-end gap-2 border-t border-white/10 pt-6">
        {workoutSession.status !== 'NOTCOMPLETED' && <NotPerformedButton workoutSessionId={workoutSession.id} />}

        <button
          type="button"
          onClick={handleFinishWorkout}
          disabled={isFinishing}
          className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isFinishing ? 'Finishing...' : 'Finish Workout'}
        </button>
      </div>
    </main>
  );
}
