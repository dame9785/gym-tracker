// Next
import Link from 'next/link';

// Components
import StartWorkoutButton from '@/components/workout/start-workout-button';

// Icons
import { CalendarDays, Clock3, Dumbbell, ListChecks, Scale } from 'lucide-react';

// Types
import type { WeeklyWorkoutViewModel } from '@/types/workout-types';

type Props = {
  workout: WeeklyWorkoutViewModel;
  userToken: string;
};

export default function SelectedWorkout({ workout, userToken }: Props) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800/80 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
              <Dumbbell className="h-7 w-7" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-orange-400">Selected workout</p>

              <h3 className="mt-1 text-2xl font-bold text-white">{workout.workoutName}</h3>

              <p className="mt-1 text-sm text-zinc-500">
                {new Date(workout.date).toLocaleDateString('sv-SE', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-px border-b border-zinc-800 bg-zinc-800 sm:grid-cols-3">
        {/* Exercises */}
        <div className="bg-zinc-900/80 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <ListChecks className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-zinc-500">Exercises</p>

              <p className="mt-0.5 text-lg font-bold text-white">{workout.exerciseCount}</p>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="bg-zinc-900/80 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Clock3 className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-zinc-500">Duration</p>

              <p className="mt-0.5 text-lg font-bold text-white">{workout.estimatedMinutes} min</p>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="bg-zinc-900/80 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
              <CalendarDays className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-zinc-500">Date</p>

              <p className="mt-0.5 text-lg font-bold text-white">
                {new Date(workout.date).toLocaleDateString('sv-SE')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-white">Exercises</h4>

            <p className="mt-1 text-sm text-zinc-500">{workout.exerciseCount} exercises in this workout</p>
          </div>

          <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 sm:flex">
            <Dumbbell className="h-4 w-4 text-zinc-500" />
          </div>
        </div>

        <div className="space-y-3">
          {workout.exercises.map((exercise, index) => (
            <div
              key={`${exercise.exerciseId}-${index}`}
              className="
                group
                flex items-center justify-between gap-4
                rounded-xl
                border border-zinc-800
                bg-zinc-900/70
                p-4
                transition-all duration-200
                hover:border-zinc-700
                hover:bg-zinc-800/50
              "
            >
              {/* Exercise information */}
              <div className="flex min-w-0 items-center gap-4">
                {/* Order */}
                <div
                  className="
                    flex h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-zinc-800
                    text-sm font-bold
                    text-zinc-400
                    transition-colors
                    group-hover:bg-orange-500/10
                    group-hover:text-orange-400
                  "
                >
                  {exercise.order}
                </div>

                <div className="min-w-0">
                  <h5 className="truncate font-semibold text-white">{exercise.name}</h5>

                  <p className="mt-1 text-sm text-zinc-500">
                    {exercise.sets} sets
                    <span className="mx-2 text-zinc-700">•</span>
                    {exercise.reps} reps
                  </p>
                </div>
              </div>

              {/* Weight */}
              {exercise.weight !== undefined && exercise.weight !== null && (
                <div className="flex shrink-0 items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2">
                  <Scale className="h-4 w-4 text-orange-400" />

                  <span className="text-sm font-semibold text-orange-400">{exercise.weight} kg</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-zinc-800 bg-zinc-900/40 p-6 sm:flex-row sm:items-center sm:justify-end">
        <Link
          href={`/workout/${workout.id}`}
          className="
      inline-flex
      h-11
      min-w-[132px]
      items-center
      justify-center
      rounded-xl
      border border-zinc-700
      bg-zinc-800/60
      px-5
      text-sm
      font-semibold
      text-zinc-300
      transition-all duration-200
      hover:border-zinc-600
      hover:bg-zinc-800
      hover:text-white
    "
        >
          View Workout
        </Link>

        <StartWorkoutButton workoutId={workout.id} userToken={userToken} />
      </div>
    </div>
  );
}
