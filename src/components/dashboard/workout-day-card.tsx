
import { CalendarDays, Clock3, Dumbbell, ListChecks } from 'lucide-react';
import type { WorkoutSessionStatus } from '@prisma/client';

import type { WeeklyWorkoutViewModel } from '@/types/workout-types';

interface WorkoutDayCardProps {
  day: string;
  workout?: WeeklyWorkoutViewModel;
  onClick?: () => void;
}

export default function WorkoutDayCard({
  day,
  workout,
  onClick,
}: WorkoutDayCardProps) {
  const hasWorkout = !!workout;

  const statusConfig: Partial<
    Record<
      WorkoutSessionStatus,
      {
        border: string;
        badge: string;
        label: string;
      }
    >
  > = {
    COMPLETED: {
      border: 'border-green-500/50',
      badge: 'bg-green-500/10 text-green-400',
      label: '✓ Completed',
    },
    ACTIVE: {
      border: 'border-orange-500/50',
      badge: 'bg-orange-500/10 text-orange-400',
      label: '● Active',
    },
    NOTCOMPLETED: {
      border: 'border-red-500/50',
      badge: 'bg-red-500/10 text-red-400',
      label: '✕ Missed',
    },
  };

  const status = workout ? statusConfig[workout.status] : null;

  return (
    <div
      onClick={onClick}
      className={`
        group flex h-full min-h-[220px] min-w-0 flex-col
        rounded-2xl border bg-zinc-950/80 p-4
        transition-all duration-200
        sm:min-h-[280px]
        ${hasWorkout ? (status?.border ?? 'border-zinc-800') : 'border-zinc-800'}
        ${hasWorkout && onClick ? 'cursor-pointer hover:-translate-y-1 hover:border-zinc-600 hover:bg-zinc-900' : ''}
      `}
    >
      {/* Header */}
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0 text-zinc-600" />

          <span className="truncate text-sm font-medium text-zinc-300 sm:text-base">
            {day}
          </span>
        </div>

        {status && (
          <span
            className={`
              shrink-0 rounded-full px-2 py-1 text-xs font-semibold
              ${status.badge}
            `}
          >
            {status.label}
          </span>
        )}
      </div>

      {/* Workout */}
      {hasWorkout && workout ? (
        <div className="mt-6 flex min-h-0 flex-1 flex-col">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <Dumbbell className="h-5 w-5 text-blue-400" />
          </div>

          <h3 className="mt-4 line-clamp-2 min-h-12 break-words text-base font-semibold text-white sm:text-lg">
            {workout.workoutName}
          </h3>

          {/* Statistics */}
          <div className="mt-auto space-y-3 pt-4">
            <div className="flex min-w-0 items-center gap-2 text-sm text-zinc-500 sm:text-base">
              <ListChecks className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {workout.exerciseCount} exercises
              </span>
            </div>

            <div className="flex min-w-0 items-center gap-2 text-sm text-zinc-500 sm:text-base">
              <Clock3 className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {workout.estimatedMinutes} min
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-1 flex-col">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-900">
            <span className="text-xl">😴</span>
          </div>

          <h3 className="mt-4 text-base font-semibold text-zinc-400 sm:text-lg">
            Rest Day
          </h3>

          <p className="mt-2 text-sm text-zinc-600 sm:text-base">
            No workout planned
          </p>
        </div>
      )}
    </div>
  );
}
