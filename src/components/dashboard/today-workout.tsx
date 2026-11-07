'use client';

import { CalendarDays, CheckCircle2, Clock3, Dumbbell, Play, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { createWorkoutSessionAction } from '@/actions/workout-session-actions';
import type { WeeklyWorkoutViewModel } from '@/types/workout-types';

interface TodayWorkoutProps {
  workout?: WeeklyWorkoutViewModel;
}

export default function TodayWorkout({ workout }: TodayWorkoutProps) {
  const router = useRouter();

  const hasWorkout = !!workout;

  const handleStartWorkout = async () => {
    if (!workout) return;

    if (workout.status === 'ACTIVE' && workout.activeSessionId) {
      router.push(`/workout-sessions/${workout.activeSessionId}`);
      return;
    }

    try {
      const result = await createWorkoutSessionAction(workout.workoutId, workout.id);

      if (!result.success || !result.data) {
        console.error('Failed to start workout:', result.message);
        return;
      }

      router.push(`/workout-sessions/${result.data}`);
    } catch (error) {
      console.error('Failed to start workout:', error);
    }
  };

  return (
    <div className={`relative min-w-0 overflow-hidden rounded-2xl border bg-linear-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-4 sm:p-6 ${hasWorkout ? (workout.status === 'COMPLETED' ? 'border-green-500/30' : 'border-orange-500/30') : 'border-zinc-800'}`}>
      <div className={`absolute top-0 left-0 h-px w-full ${hasWorkout ? (workout.status === 'COMPLETED' ? 'bg-linear-to-r from-green-500/70 via-green-500/20 to-transparent' : 'bg-gradient-to-r from-orange-500/70 via-orange-500/20 to-transparent') : 'bg-zinc-700'}`} />

      {/* Header */}
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wider text-zinc-500 uppercase sm:text-sm">Today</p>

          <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">Todays Workout</h2>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800">
          <CalendarDays className="h-5 w-5 text-zinc-400" />
        </div>
      </div>

      {hasWorkout ? (
        <div className="mt-6 sm:mt-7">
          {/* Workout status */}
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10">
              <Dumbbell className="h-7 w-7 text-orange-400" />
            </div>

            {workout.status === 'COMPLETED' && (
              <div className="flex shrink-0 items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400 sm:text-sm">
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </div>
            )}

            {(workout.status === 'ACTIVE' || workout.status === null) && <div className="shrink-0 rounded-full bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-400 sm:text-sm">Ready to train</div>}

            {workout.status === 'NOTCOMPLETED' && <div className="shrink-0 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 sm:text-sm">Missed</div>}
          </div>

          {/* Workout information */}
          <div className="mt-5 min-w-0">
            <h3 className="text-xl font-bold tracking-tight break-words text-white sm:text-2xl">{workout.workoutName}</h3>

            <p className="mt-2 text-sm leading-5 text-zinc-500 sm:text-base sm:leading-6">{workout.status === 'COMPLETED' ? 'Great work! You completed your workout today.' : workout.status === 'NOTCOMPLETED' ? 'This workout was not completed.' : 'Everything is ready. Time to get started.'}</p>
          </div>

          {/* Statistics */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex min-w-0 items-center gap-2 rounded-xl bg-zinc-800/70 px-3 py-3 sm:px-4">
              <Dumbbell className="h-4 w-4 shrink-0 text-zinc-500" />

              <div className="min-w-0">
                <p className="text-xs text-zinc-500 sm:text-sm">Exercises</p>

                <p className="text-sm font-semibold text-zinc-200 sm:text-base">{workout.exerciseCount}</p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-2 rounded-xl bg-zinc-800/70 px-3 py-3 sm:px-4">
              <Clock3 className="h-4 w-4 shrink-0 text-zinc-500" />

              <div className="min-w-0">
                <p className="text-xs text-zinc-500 sm:text-sm">Duration</p>

                <p className="text-sm font-semibold text-zinc-200 sm:text-base">{workout.estimatedMinutes} min</p>
              </div>
            </div>
          </div>

          {/* Start workout */}
          {(workout.status === 'ACTIVE' || workout.status === null) && (
            <button
              type="button"
              onClick={handleStartWorkout}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 transition-all duration-200 hover:bg-orange-400 hover:shadow-orange-500/20 active:scale-[0.98] sm:text-base"
            >
              <Play className="h-4 w-4 fill-current" />
              Start Workout
            </button>
          )}

          {/* Completed */}
          {workout.status === 'COMPLETED' && (
            <div className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-5 py-3.5 text-sm font-semibold text-green-400 sm:text-base">
              <CheckCircle2 className="h-5 w-5" />
              Workout Completed
            </div>
          )}

          {/* Not completed */}
          {workout.status === 'NOTCOMPLETED' && (
            <button type="button" onClick={handleStartWorkout} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-5 py-3.5 text-sm font-semibold text-orange-400 transition-all duration-200 hover:bg-orange-500/15 sm:text-base">
              <RotateCcw className="h-4 w-4" />
              Start Workout
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 sm:mt-7">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800">
            <span className="text-2xl">😴</span>
          </div>

          <h3 className="mt-5 text-xl font-bold text-zinc-300 sm:text-2xl">Rest Day</h3>

          <p className="mt-2 text-sm leading-5 text-zinc-500 sm:text-base sm:leading-6">No workout planned for today. Take some time to recover.</p>

          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-sm leading-5 font-medium text-zinc-400 sm:text-base sm:leading-6">Recovery is part of the progress.</p>
          </div>
        </div>
      )}
    </div>
  );
}
