import StartWorkoutButton from '@/components/workout/start-workout-button';
import Button from '@/components/button/button';
import Card from '@/components/ui/card';

import { CalendarDays, Clock3, Dumbbell, ListChecks, Scale } from 'lucide-react';

import type { WeeklyWorkoutViewModel } from '@/types/workout-types';

type Props = {
  workout: WeeklyWorkoutViewModel;
};

export default function SelectedWorkout({ workout }: Props) {
  const formattedDate = new Date(workout.date).toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const shortDate = new Date(workout.date).toLocaleDateString('sv-SE');

  return (
    <Card padding="none" accent className="mt-8 overflow-hidden">
      {/* Header */}
      <div className="border-border border-b p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="border-primary/10 bg-primary/10 text-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border">
            <Dumbbell className="h-7 w-7" />
          </div>

          <div className="min-w-0">
            <p className="text-primary text-xs font-semibold tracking-wider uppercase">Selected workout</p>

            <h3 className="text-text mt-1 text-xl font-semibold tracking-tight break-words sm:text-2xl">{workout.workoutName}</h3>

            <p className="text-text-muted mt-1 text-sm">{formattedDate}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-surface-secondary grid grid-cols-1 gap-px sm:grid-cols-3">
        <div className="bg-surface/80 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <ListChecks className="h-4 w-4" />
            </div>

            <div>
              <p className="text-text-muted text-xs">Exercises</p>
              <p className="text-text-secondary mt-0.5 text-lg font-medium">{workout.exerciseCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface/80 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <Clock3 className="h-4 w-4" />
            </div>

            <div>
              <p className="text-text-muted text-xs">Duration</p>
              <p className="text-text-secondary mt-0.5 text-lg font-medium">{workout.estimatedMinutes} min</p>
            </div>
          </div>
        </div>

        <div className="bg-surface/80 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <CalendarDays className="h-4 w-4" />
            </div>

            <div>
              <p className="text-text-muted text-xs">Date</p>
              <p className="text-text-secondary mt-0.5 text-lg font-medium">{shortDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="p-4 sm:p-6">
        <div className="mb-5">
          <h4 className="text-text text-base font-semibold tracking-tight sm:text-lg">Exercises</h4>

          <p className="text-text-muted mt-1 text-sm">{workout.exerciseCount} exercises in this workout</p>
        </div>

        <div className="space-y-3">
          {workout.exercises.map((exercise) => (
            <div key={exercise.exerciseId} className="group border-border bg-surface/60 hover:border-border-hover hover:bg-surface-hover/40 flex items-center justify-between gap-3 rounded-xl border p-3 transition-colors duration-200 sm:gap-4 sm:p-4">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="bg-surface-secondary text-text-muted group-hover:bg-primary/10 group-hover:text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-colors sm:h-10 sm:w-10">{exercise.order}</div>

                <div className="min-w-0">
                  <h5 className="text-text-secondary truncate text-sm font-medium sm:text-base">{exercise.name}</h5>

                  <p className="text-text-muted mt-1 text-xs sm:text-sm">
                    {exercise.sets} sets
                    {exercise.reps > 0 && (
                      <>
                        <span className="text-text-muted mx-2">•</span>
                        {exercise.reps} reps
                      </>
                    )}
                    {exercise.seconds > 0 && (
                      <>
                        <span className="text-text-muted mx-2">•</span>
                        {exercise.seconds} seconds
                      </>
                    )}
                  </p>
                </div>
              </div>

              {exercise.weight !== null && (
                <div className="border-primary/20 bg-primary/[0.06] flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
                  <Scale className="text-primary h-3.5 w-3.5 sm:h-4 sm:w-4" />

                  <span className="text-primary text-xs font-medium sm:text-sm">{exercise.weight} kg</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="border-border flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-end sm:p-6">
        <Button variant="secondary" size="md" href={`/workout/${workout.workoutId}`}>
          View Workout
        </Button>

        {workout.status !== 'COMPLETED' && <StartWorkoutButton workoutId={workout.workoutId} workoutScheduleId={workout.id} activeSessionId={workout.activeSessionId} />}
      </div>
    </Card>
  );
}
