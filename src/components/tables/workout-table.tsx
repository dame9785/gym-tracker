'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarDays, ChevronDown, Dumbbell, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

import type { WorkoutViewModel } from '@/types/workout-types';
import { deleteWorkoutAction } from '@/actions/workout-actions';

type Props = {
  workouts: WorkoutViewModel[];
};

export default function WorkoutTable({ workouts }: Props) {
  const router = useRouter();

  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutViewModel | null>(null);

  const handleDelete = (id: number) => {
    toast('Are you sure you want to delete this workout?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          await removeWorkout(id);
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  const removeWorkout = async (id: number): Promise<void> => {
    try {
      const response = await deleteWorkoutAction(id);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      setSelectedWorkout((current) => (current?.id === id ? null : current));

      toast.success(response.message);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete workout:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <section className="w-full">
        {/* Section header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Your workouts</h2>

            <p className="mt-1 text-sm text-zinc-500">
              {workouts.length} {workouts.length === 1 ? 'workout' : 'workouts'} on this page
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
            <Dumbbell className="h-5 w-5 text-orange-400" />
          </div>
        </div>

        {/* Workout cards */}
        {workouts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {workouts.map((workout) => (
              <article
                key={workout.id}
                className="
                  group flex min-w-0 flex-col rounded-2xl
                  border border-zinc-800 bg-zinc-900/70 p-5
                  transition-all duration-200
                  hover:border-orange-500/30
                  hover:bg-zinc-900
                  hover:shadow-lg hover:shadow-black/20
                "
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="
                      flex h-12 w-12 shrink-0 items-center justify-center
                      rounded-xl border border-orange-500/20
                      bg-orange-500/10 text-orange-400
                      transition-transform duration-200
                      group-hover:scale-105
                    "
                    >
                      <Dumbbell className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-white">{workout.name}</h3>

                      <p className="mt-1 text-xs text-zinc-500">Workout #{workout.id}</p>
                    </div>
                  </div>

                  {/* Edit and delete */}
                  <div className="flex shrink-0 gap-1">
                    <Link
                      href={`/workout/edit/${workout.id}`}
                      aria-label={`Edit ${workout.name}`}
                      title="Edit workout"
                      className="
                        flex h-9 w-9 items-center justify-center rounded-lg
                        text-zinc-400 transition-colors
                        hover:bg-orange-500/10 hover:text-orange-400
                      "
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(workout.id)}
                      aria-label={`Delete ${workout.name}`}
                      title="Delete workout"
                      className="
                        flex h-9 w-9 items-center justify-center rounded-lg
                        text-zinc-500 transition-colors
                        hover:bg-red-500/10 hover:text-red-400
                      "
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-4 min-h-10 text-sm leading-5 text-zinc-400" title={workout.description ?? undefined}>
                  {workout.description || 'No description added yet.'}
                </p>

                {/* Exercise section */}
                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Exercises</h4>

                    <span
                      className="
                      rounded-full border border-zinc-700
                      bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400
                    "
                    >
                      {workout.workoutExercises.length} total
                    </span>
                  </div>

                  {workout.workoutExercises.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {workout.workoutExercises.slice(0, 3).map((exercise) => (
                        <span
                          key={exercise.exerciseId}
                          className="
                              inline-flex max-w-full items-center
                              rounded-lg border border-blue-500/20
                              bg-blue-500/10 px-2.5 py-1.5
                              text-xs font-medium text-blue-400
                            "
                        >
                          <span className="truncate">{exercise.name}</span>
                        </span>
                      ))}

                      {workout.workoutExercises.length > 3 && (
                        <button
                          type="button"
                          onClick={() => setSelectedWorkout(workout)}
                          className="
                            inline-flex cursor-pointer items-center gap-1
                            rounded-lg border border-zinc-700
                            bg-zinc-800/60 px-2.5 py-1.5
                            text-xs font-medium text-zinc-300
                            transition-colors
                            hover:border-orange-500/30
                            hover:text-orange-400
                          "
                        >
                          +{workout.workoutExercises.length - 3} more
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-600">No exercises added yet.</p>
                  )}
                </div>

                {/* Dates */}
                <div
                  className="
                  mt-5 space-y-2 border-t border-zinc-800
                  pt-4 text-xs text-zinc-500
                "
                >
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5 text-orange-400" />
                    <span>Created:</span>
                    <time className="ml-auto text-zinc-400">{new Date(workout.createdAt).toLocaleDateString('sv-SE')}</time>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5 text-orange-400" />
                    <span>Updated:</span>
                    <time className="ml-auto text-zinc-400">{new Date(workout.updatedAt).toLocaleDateString('sv-SE')}</time>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div
            className="
            flex flex-col items-center justify-center rounded-2xl
            border border-dashed border-zinc-800 bg-zinc-900/40
            px-6 py-16 text-center
          "
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800">
              <Dumbbell className="h-6 w-6 text-orange-400" />
            </div>

            <h3 className="mt-4 font-semibold text-white">No workouts yet</h3>

            <p className="mt-2 max-w-sm text-sm text-zinc-500">Create your first workout to start building your workout library.</p>

            <Link
              href="/workout/register"
              className="
                mt-5 rounded-xl bg-orange-500 px-4 py-2.5
                text-sm font-semibold text-white transition-colors
                hover:bg-orange-400
              "
            >
              Create workout
            </Link>
          </div>
        )}
      </section>

      {/* All exercises dialog */}
      {selectedWorkout && (
        <div
          className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/70 p-4 backdrop-blur-sm
          "
          onClick={() => setSelectedWorkout(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="workout-dialog-title"
            className="
              w-full max-w-lg overflow-hidden rounded-2xl
              border border-zinc-800 bg-zinc-950 shadow-2xl
            "
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
              <div>
                <h2 id="workout-dialog-title" className="text-lg font-semibold text-white">
                  {selectedWorkout.name}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  {selectedWorkout.workoutExercises.length} {selectedWorkout.workoutExercises.length === 1 ? 'exercise' : 'exercises'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedWorkout(null)}
                aria-label="Close dialog"
                className="
                  rounded-lg p-2 text-zinc-400
                  transition-colors hover:bg-zinc-800 hover:text-white
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] space-y-2 overflow-y-auto p-6">
              {selectedWorkout.workoutExercises.map((exercise, index) => (
                <div
                  key={exercise.exerciseId}
                  className="
                    flex items-center gap-3 rounded-xl
                    border border-zinc-800 bg-zinc-900 p-3
                  "
                >
                  <span
                    className="
                    flex h-9 w-9 shrink-0 items-center justify-center
                    rounded-lg bg-blue-500/10 text-sm font-semibold
                    text-blue-400
                  "
                  >
                    {index + 1}
                  </span>

                  <span className="text-sm font-medium text-zinc-200">{exercise.name}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedWorkout(null)}
                className="
                  w-full cursor-pointer rounded-xl bg-zinc-800
                  px-4 py-2.5 text-sm font-medium text-white
                  transition-colors hover:bg-zinc-700
                "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
