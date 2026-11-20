import { CalendarDays, Clock3, Dumbbell, ListChecks } from 'lucide-react';

import type { WeeklyWorkoutViewModel } from '@/types/workout-types';
import { WORKOUT_STATUS_CONFIG } from '@/components/shared/workout-status';
import Button from '@/components/button/button';

interface WorkoutDayCardProps {
  day: string;
  workout?: WeeklyWorkoutViewModel;
  onClick?: () => void;
}

export default function WorkoutDayCard({ day, workout, onClick }: WorkoutDayCardProps) {
  const hasWorkout = !!workout;
  const isPlanned = hasWorkout && !workout.status;

  const status = workout?.status ? WORKOUT_STATUS_CONFIG[workout.status] : null;

  const statusStyles =
    workout?.status === 'COMPLETED'
      ? {
          border: '!border-success/70',
          background: '!bg-success/10',
          hover: 'hover:!border-success hover:!bg-success/15',
          iconBackground: 'bg-success/15',
          iconColor: 'text-success',
          textColor: 'text-success',
        }
      : workout?.status === 'NOTCOMPLETED'
        ? {
            border: '!border-danger/70',
            background: '!bg-danger/10',
            hover: 'hover:!border-danger hover:!bg-danger/15',
            iconBackground: 'bg-danger/15',
            iconColor: 'text-danger',
            textColor: 'text-danger',
          }
        : isPlanned
          ? {
              border: '!border-primary/70',
              background: '!bg-primary/10',
              hover: 'hover:!border-primary hover:!bg-primary/15',
              iconBackground: 'bg-primary/15',
              iconColor: 'text-primary',
              textColor: 'text-primary',
            }
          : {
              border: '!border-border',
              background: '!bg-background/80',
              hover: 'hover:!border-border-hover',
              iconBackground: 'bg-surface',
              iconColor: 'text-text-muted',
              textColor: 'text-text-muted',
            };

  const cardClassName = `group flex h-full min-h-[220px] min-w-0 flex-col rounded-2xl border-2 p-4 transition-all duration-200 sm:min-h-[280px] ${statusStyles.border} ${statusStyles.background} ${hasWorkout && onClick ? `cursor-pointer hover:-translate-y-1 ${statusStyles.hover}` : ''}`;

  const content = (
    <>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <CalendarDays className="text-text-muted h-4 w-4 shrink-0" />

          <span className="text-text-secondary truncate text-sm font-medium sm:text-base">{day}</span>
        </div>

        {hasWorkout && (
          <span className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${status?.badgeClassName ?? 'bg-primary/10 text-primary'}`}>
            {status?.icon ?? <Dumbbell className="h-3.5 w-3.5" />}
            {status?.label ?? 'Planned'}
          </span>
        )}
      </div>

      {hasWorkout && workout ? (
        <div className="mt-6 flex min-h-0 flex-1 flex-col">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${statusStyles.iconBackground}`}>
            <Dumbbell className={`h-5 w-5 ${statusStyles.iconColor}`} />
          </div>

          <h3 className="text-text mt-4 line-clamp-2 min-h-12 text-base font-semibold break-words sm:text-lg">{workout.workoutName}</h3>

          <div className="mt-auto space-y-3 pt-4">
            <div className="text-text-muted flex min-w-0 items-center gap-2 text-sm sm:text-base">
              <ListChecks className="h-4 w-4 shrink-0" />

              <span className="truncate">{workout.exerciseCount} exercises</span>
            </div>

            <div className="text-text-muted flex min-w-0 items-center gap-2 text-sm sm:text-base">
              <Clock3 className="h-4 w-4 shrink-0" />

              <span className="truncate">{workout.estimatedMinutes} min</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-1 flex-col">
          <div className="bg-surface flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
            <span className="text-xl">😴</span>
          </div>

          <h3 className="text-text-muted mt-4 text-base font-semibold sm:text-lg">Rest Day</h3>

          <p className="text-text-muted mt-2 text-sm sm:text-base">No workout planned</p>
        </div>
      )}
    </>
  );

  if (hasWorkout && onClick) {
    return (
      <Button type="button" variant="ghost" size="md" onClick={onClick} className={`!h-auto !w-full !min-w-0 !flex-col !items-stretch !justify-start !rounded-2xl !border-2 !p-4 !text-left !font-normal !tracking-normal ${cardClassName}`}>
        {content}
      </Button>
    );
  }

  return <div className={cardClassName}>{content}</div>;
}
