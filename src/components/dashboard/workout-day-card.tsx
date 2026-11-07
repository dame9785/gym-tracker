
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
        group flex h-full min-h-[260px] min-w-0 flex-col
        rounded-2xl border bg-zinc-950/80 p-3
        transition-all duration-200
        sm:min-h-[280px] sm:p-4
        ${hasWorkout ? (status?.border ?? 'border-zinc-800') : 'border-zinc-800'}
        ${hasWorkout && onClick ? 'cursor-pointer hover:-translate-y-1 hover:border-zinc-600 hover:bg-zinc-900' : ''}
      `}
    >
      {/* Header */}
      <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-zinc-600 sm:h-4 sm:w-4" />

          <span className="truncate text-xs font-medium text-zinc-300 sm:text-sm">
            {day}
          </span>
        </div>

        {status && (
          <span
            className={`
              max-w-full rounded-full px-2 py-1
              text-[9px] font-semibold sm:text-[10px]
              ${status.badge}
            `}
          >
            {status.label}
          </span>
        )}
      </div>

      {/* Workout content */}
      {hasWorkout && workout ? (
        <div className="mt-4 flex min-h-0 flex-1 flex-col sm:mt-7">
          {/* Icon */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 sm:h-11 sm:w-11 sm:rounded-xl">
            <Dumbbell className="h-4 w-4 text-blue-400 sm:h-5 sm:w-5" />
          </div>

          {/* Workout name */}
          <h3 className="mt-3 line-clamp-2 min-h-[40px] break-words text-sm font-semibold text-white sm:mt-4 sm:min-h-[48px] sm:text-base">
            {workout.workoutName}
          </h3>

          {/* Stats */}
          <div className="mt-auto space-y-2 pt-3">
            <div className="flex min-w-0 items-center gap-1.5 text-xs text-zinc-500 sm:gap-2 sm:text-sm">
              <ListChecks className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />

              <span className="truncate">
                {workout.exerciseCount} exercises
              </span>
            </div>

            <div className="flex min-w-0 items-center gap-1.5 text-xs text-zinc-500 sm:gap-2 sm:text-sm">
              <Clock3 className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />

              <span className="truncate">
                {workout.estimatedMinutes} min
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Rest day content */
        <div className="mt-4 flex flex-1 flex-col sm:mt-7">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900 sm:h-11 sm:w-11 sm:rounded-xl">
            <span className="text-lg sm:text-xl">😴</span>
          </div>

          <h3 className="mt-3 text-sm font-semibold text-zinc-400 sm:mt-4 sm:text-base">
            Rest Day
          </h3>

          <p className="mt-2 text-xs text-zinc-600 sm:text-sm">
            No workout planned
          </p>
        </div>
      )}
    </div>
  );
}
