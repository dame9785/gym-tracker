'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import WorkoutSessionService from '@/services/workout-session-service';
import type { WorkoutSessionViewModel } from '@/types/workout-types';

import WorkoutSessionExerciseCard from '@/components/workout/workout-session-exercise-card';

interface WorkoutSessionProps {
  workoutSession: WorkoutSessionViewModel;
}

export default function WorkoutSession({ workoutSession }: WorkoutSessionProps) {
  const router = useRouter();

  const handleFinishWorkout = async () => {
    const confirmed = confirm('Är du säker på att du vill avsluta träningspasset?');

    if (!confirmed) {
      return;
    }

    const result = await WorkoutSessionService.finish(workoutSession.id);
    if (!result.success) {
      toast.error('Något gick fel, passet kunde inte avslutas.');
      return;
    }

    toast.success('Träningspasset avslutat');
    router.push('/dashboard');
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wider text-blue-400">Pågående träningspass</p>

        <div className="mt-1 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Workout #{workoutSession.id}</h1>

          <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-400">
            Pågår
          </span>
        </div>

        <p className="mt-2 text-sm text-zinc-500">Registrera dina faktiska reps och vikter för varje set.</p>
      </header>

      {/* Exercises */}
      <div className="space-y-5">
        {workoutSession.exercises.map((exercise) => (
          <WorkoutSessionExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>

      {/* Finish workout */}
      <div className="mt-8 flex justify-end border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={handleFinishWorkout}
          className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 transition hover:bg-orange-400"
        >
          Avsluta träningspass
        </button>
      </div>
    </main>
  );
}
