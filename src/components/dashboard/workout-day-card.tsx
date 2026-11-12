import { CalendarDays, Clock3, Dumbbell, ListChecks } from 'lucide-react';

import type { WeeklyWorkoutViewModel } from '@/types/workout-types';
import { WORKOUT_STATUS_CONFIG } from '@/components/shared/workout-status';

interface WorkoutDayCardProps {
  day: string;
  workout?: WeeklyWorkoutViewModel;
  onClick?: () => void;
}

export default function WorkoutDayCard({ day, workout, onClick }: WorkoutDayCardProps) {
  const hasWorkout = !!workout;

  const status = workout?.status ? WORKOUT_STATUS_CONFIG[workout.status] : null;

  const cardClassName = `group flex h-full min-h-[220px] min-w-0 flex-col rounded-2xl border ${status?.borderClassName ?? 'border-zinc-800'} ${workout?.status === 'COMPLETED' ? 'bg-emerald-950/30' : 'bg-zinc-950/80'} p-4 transition-all duration-200 sm:min-h-[280px] ${
    hasWorkout && onClick ? 'cursor-pointer hover:-translate-y-1 hover:border-emerald-400/60' : ''
  }`;

  const content = (
    <>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0 text-zinc-600" />

          <span className="truncate text-sm font-medium text-zinc-300 sm:text-base">{day}</span>
        </div>

        {status && (
          <span className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${status.badgeClassName}`}>
            {status.icon}
            {status.label}
          </span>
        )}
      </div>

      {hasWorkout && workout ? (
        <div className="mt-6 flex min-h-0 flex-1 flex-col">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <Dumbbell className="h-5 w-5 text-blue-400" />
          </div>

          <h3 className="mt-4 line-clamp-2 min-h-12 text-base font-semibold break-words text-white sm:text-lg">{workout.workoutName}</h3>

          <div className="mt-auto space-y-3 pt-4">
            <div className="flex min-w-0 items-center gap-2 text-sm text-zinc-500 sm:text-base">
              <ListChecks className="h-4 w-4 shrink-0" />

              <span className="truncate">{workout.exerciseCount} exercises</span>
            </div>

            <div className="flex min-w-0 items-center gap-2 text-sm text-zinc-500 sm:text-base">
              <Clock3 className="h-4 w-4 shrink-0" />

              <span className="truncate">{workout.estimatedMinutes} min</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-1 flex-col">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-900">
            <span className="text-xl">😴</span>
          </div>

          <h3 className="mt-4 text-base font-semibold text-zinc-400 sm:text-lg">Rest Day</h3>

          <p className="mt-2 text-sm text-zinc-600 sm:text-base">No workout planned</p>
        </div>
      )}
    </>
  );

  if (hasWorkout && onClick) {
    return (
      <button type="button" onClick={onClick} className={`${cardClassName} w-full text-left`}>
        {content}
      </button>
    );
  }

  return <div className={cardClassName}>{content}</div>;
}
