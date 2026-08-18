import { CalendarDays, Clock3, Dumbbell, ListChecks } from 'lucide-react';

import type { WeeklyWorkoutViewModel } from '@/types/workout-types';

interface WorkoutDayCardProps {
  day: string;
  workout?: WeeklyWorkoutViewModel;
  onClick?: () => void;
}

export default function WorkoutDayCard({ day, workout, onClick }: WorkoutDayCardProps) {
  const hasWorkout = !!workout;

  const statusConfig = {
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
        group min-h-[220px] rounded-2xl border
        bg-zinc-950/80 p-4
        transition-all duration-200
        ${hasWorkout ? status?.border : 'border-zinc-800'}
        ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:border-zinc-600 hover:bg-zinc-900' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-zinc-600" />

          <span className="text-sm font-medium text-zinc-300">{day}</span>
        </div>

        {status && (
          <span
            className={`
              rounded-full px-2 py-1
              text-[10px] font-semibold
              ${status.badge}
            `}
          >
            {status.label}
          </span>
        )}
      </div>

      {/* Content */}
      {hasWorkout ? (
        <div className="mt-7">
          {/* Icon */}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
            <Dumbbell className="h-5 w-5 text-blue-400" />
          </div>

          {/* Workout name */}
          <h3 className="mt-4 line-clamp-2 min-h-[48px] text-base font-semibold text-white">{workout.workoutName}</h3>

          {/* Stats */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <ListChecks className="h-4 w-4" />

              <span>{workout.exerciseCount} exercises</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Clock3 className="h-4 w-4" />

              <span>{workout.estimatedMinutes} min</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-7">
          {/* Rest icon */}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900">
            <span className="text-xl">😴</span>
          </div>

          <h3 className="mt-4 text-base font-semibold text-zinc-400">Rest Day</h3>

          <p className="mt-2 text-sm text-zinc-600">No workout planned</p>
        </div>
      )}
    </div>
  );
}
