'use client';

import { CalendarDays, CheckCircle2, Clock3, Dumbbell, Play, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Types
import { WeeklyWorkoutViewModel } from '@/types/dashboard-types';

// Services
import WorkoutSessionService from '@/services/workout-session-service';

interface TodayWorkoutProps {
  workout?: WeeklyWorkoutViewModel;
}

export default function TodayWorkout({ workout }: TodayWorkoutProps) {
  const router = useRouter();
  const workoutSessionService = new WorkoutSessionService();

  const hasWorkout = !!workout;

  const handleStartWorkout = async () => {
    if (!workout) {
      return;
    }

    if (workout.status === 'ACTIVE' && workout.activeSessionId) {
      router.push(`/workout-sessions/${workout.activeSessionId}`);
      return;
    }

    const result = await workoutSessionService.create(workout.id);

    console.log(result);

    if (result.success) {
      router.push(`/workout-sessions/${result.workoutSession.id}`);
    }
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border
        bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950
        p-6
        ${
          hasWorkout
            ? workout.status === 'COMPLETED'
              ? 'border-green-500/30'
              : 'border-orange-500/30'
            : 'border-zinc-800'
        }
      `}
    >
      {/* Top accent */}
      <div
        className={`
          absolute left-0 top-0 h-px w-full
          ${
            hasWorkout
              ? workout.status === 'COMPLETED'
                ? 'bg-gradient-to-r from-green-500/70 via-green-500/20 to-transparent'
                : 'bg-gradient-to-r from-orange-500/70 via-orange-500/20 to-transparent'
              : 'bg-zinc-700'
          }
        `}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Today</p>

          <h2 className="mt-1 text-xl font-bold text-white">Today's Workout</h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">
          <CalendarDays className="h-5 w-5 text-zinc-400" />
        </div>
      </div>

      {hasWorkout ? (
        <div className="mt-7">
          {/* Workout icon + status */}
          <div className="flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10">
              <Dumbbell className="h-7 w-7 text-orange-400" />
            </div>

            {workout.status === 'COMPLETED' && (
              <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </div>
            )}

            {workout.status === 'ACTIVE' && (
              <div className="rounded-full bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-400">
                Ready to train
              </div>
            )}

            {workout.status === 'NOTCOMPLETED' && (
              <div className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400">Missed</div>
            )}
          </div>

          {/* Workout information */}
          <div className="mt-5">
            <h3 className="text-2xl font-bold tracking-tight text-white">{workout.workoutName}</h3>

            <p className="mt-2 text-sm text-zinc-500">
              {workout.status === 'COMPLETED'
                ? 'Great work! You completed your workout today.'
                : workout.status === 'NOTCOMPLETED'
                  ? 'This workout was not completed.'
                  : 'Everything is ready. Time to get started.'}
            </p>
          </div>

          {/* Stats */}
          <div className="mt-6 flex gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-zinc-800/70 px-4 py-3">
              <Dumbbell className="h-4 w-4 text-zinc-500" />

              <div>
                <p className="text-xs text-zinc-500">Exercises</p>
                <p className="text-sm font-semibold text-zinc-200">{workout.exerciseCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-zinc-800/70 px-4 py-3">
              <Clock3 className="h-4 w-4 text-zinc-500" />

              <div>
                <p className="text-xs text-zinc-500">Duration</p>
                <p className="text-sm font-semibold text-zinc-200">{workout.estimatedMinutes} min</p>
              </div>
            </div>
          </div>

          {/* Action */}
          {workout.status === 'ACTIVE' && (
            <button
              onClick={handleStartWorkout}
              className="
                mt-6 flex w-full items-center justify-center gap-2
                rounded-xl bg-orange-500 px-5 py-3.5
                font-semibold text-white
                shadow-lg shadow-orange-500/10
                transition-all duration-200
                hover:bg-orange-400
                hover:shadow-orange-500/20
                active:scale-[0.98]
              "
            >
              <Play className="h-4 w-4 fill-current" />
              Start Workout
            </button>
          )}

          {workout.status === 'COMPLETED' && (
            <div
              className="
                mt-6 flex w-full items-center justify-center gap-2
                rounded-xl border border-green-500/20
                bg-green-500/5 px-5 py-3.5
                font-semibold text-green-400
              "
            >
              <CheckCircle2 className="h-5 w-5" />
              Workout Completed
            </div>
          )}

          {workout.status === 'NOTCOMPLETED' && (
            <button
              onClick={handleStartWorkout}
              className="
                mt-6 flex w-full items-center justify-center gap-2
                rounded-xl border border-orange-500/30
                bg-orange-500/10 px-5 py-3.5
                font-semibold text-orange-400
                transition-all duration-200
                hover:bg-orange-500/15
              "
            >
              <RotateCcw className="h-4 w-4" />
              Start Workout
            </button>
          )}
        </div>
      ) : (
        /* Rest day */
        <div className="mt-7">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800">
            <span className="text-2xl">😴</span>
          </div>

          <h3 className="mt-5 text-2xl font-bold text-zinc-300">Rest Day</h3>

          <p className="mt-2 text-sm text-zinc-500">No workout planned for today. Take some time to recover.</p>

          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-sm font-medium text-zinc-400">Recovery is part of the progress.</p>
          </div>
        </div>
      )}
    </div>
  );
}
