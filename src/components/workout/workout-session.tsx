'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { WorkoutSessionViewModel } from '@/types/workout-types';

import WorkoutSessionExerciseCard from '@/components/workout/workout-session-exercise-card';
import NotPerformedButton from '@/components/dashboard/not-perfomed-button';
import Button from '@/components/button/button';

import { finishWorkoutSessionAction } from '@/actions/workout-session-actions';

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
      const result = await finishWorkoutSessionAction(workoutSession.id);

      if (!result.success) {
        toast.error(result.message || 'Could not finish workout. Please try again.');
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
        <p className="text-info text-sm font-medium tracking-wider uppercase">Workout in progress</p>

        <div className="mt-1 flex items-center justify-between gap-4">
          <h1 className="text-text text-3xl font-bold tracking-tight sm:text-4xl">Workout #{workoutSession.id}</h1>

          <span className="border-primary/20 bg-primary/10 text-primary rounded-full border px-3 py-1.5 text-xs font-medium">In progress</span>
        </div>

        <p className="text-text-muted mt-2 text-sm">Record your actual reps, weights, and seconds for each set.</p>
      </header>

      <div className="space-y-5">
        {workoutSession.exercises.map((exercise) => (
          <WorkoutSessionExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>

      <div className="border-border mt-8 flex justify-end gap-2 border-t pt-6">
        {workoutSession.status !== 'NOTCOMPLETED' && <NotPerformedButton workoutSessionId={workoutSession.id} />}

        <Button type="button" variant="primary" size="lg" onClick={handleFinishWorkout} disabled={isFinishing} className="!shadow-primary/10 !rounded-xl !px-6 !py-3 !text-sm !font-semibold !shadow-lg">
          {isFinishing ? 'Finishing...' : 'Finish Workout'}
        </Button>
      </div>
    </main>
  );
}
