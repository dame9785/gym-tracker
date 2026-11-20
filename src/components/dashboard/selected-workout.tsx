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
      <div className="border-b border-zinc-800/80 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-orange-500/10 bg-orange-500/10 text-orange-400">
            <Dumbbell className="h-7 w-7" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wider text-orange-400 uppercase">Selected workout</p>

            <h3 className="mt-1 text-xl font-semibold tracking-tight break-words text-zinc-100 sm:text-2xl">{workout.workoutName}</h3>

            <p className="mt-1 text-sm text-zinc-500">{formattedDate}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-px bg-zinc-800 sm:grid-cols-3">
        <div className="bg-zinc-900/80 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
              <ListChecks className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-zinc-500">Exercises</p>
              <p className="mt-0.5 text-lg font-medium text-zinc-200">{workout.exerciseCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/80 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
              <Clock3 className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-zinc-500">Duration</p>
              <p className="mt-0.5 text-lg font-medium text-zinc-200">{workout.estimatedMinutes} min</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/80 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
              <CalendarDays className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-zinc-500">Date</p>
              <p className="mt-0.5 text-lg font-medium text-zinc-200">{shortDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="p-4 sm:p-6">
        <div className="mb-5">
          <h4 className="text-base font-semibold tracking-tight text-zinc-100 sm:text-lg">Exercises</h4>

          <p className="mt-1 text-sm text-zinc-500">{workout.exerciseCount} exercises in this workout</p>
        </div>

        <div className="space-y-3">
          {workout.exercises.map((exercise) => (
            <div key={exercise.exerciseId} className="group flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 transition-colors duration-200 hover:border-zinc-700 hover:bg-zinc-800/40 sm:gap-4 sm:p-4">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-sm font-medium text-zinc-400 transition-colors group-hover:bg-orange-500/10 group-hover:text-orange-400 sm:h-10 sm:w-10">{exercise.order}</div>

                <div className="min-w-0">
                  <h5 className="truncate text-sm font-medium text-zinc-200 sm:text-base">{exercise.name}</h5>

                  <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                    {exercise.sets} sets
                    {exercise.reps > 0 && (
                      <>
                        <span className="mx-2 text-zinc-700">•</span>
                        {exercise.reps} reps
                      </>
                    )}
                    {exercise.seconds > 0 && (
                      <>
                        <span className="mx-2 text-zinc-700">•</span>
                        {exercise.seconds} seconds
                      </>
                    )}
                  </p>
                </div>
              </div>

              {exercise.weight !== null && (
                <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-orange-500/20 bg-orange-500/[0.06] px-2.5 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
                  <Scale className="h-3.5 w-3.5 text-orange-400 sm:h-4 sm:w-4" />

                  <span className="text-xs font-medium text-orange-400 sm:text-sm">{exercise.weight} kg</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-zinc-800/80 p-4 sm:flex-row sm:items-center sm:justify-end sm:p-6">
        <Button variant="secondary" size="md" href={`/workout/${workout.workoutId}`}>
          View Workout
        </Button>

        {workout.status !== 'COMPLETED' && <StartWorkoutButton workoutId={workout.workoutId} workoutScheduleId={workout.id} activeSessionId={workout.activeSessionId} />}
      </div>
    </Card>
  );
}
