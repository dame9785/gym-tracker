'use client';

import { useState } from 'react';
import { CalendarDays, Dumbbell, Pencil, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Types
import type { WorkoutViewModel } from '@/types/workout-types';
import { deleteWorkoutAction } from '@/actions/workout-actions';

type Props = {
  workouts: WorkoutViewModel[];
};

export default function WorkoutTable({ workouts }: Props) {
  const router = useRouter();

  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutViewModel | null>(null);

  // Handle delete
  const handleDelete = (id: number) => {
    verifyDelete(id);
  };

  // Verify delete
  const verifyDelete = (id: number): void => {
    toast('Are you sure you want to delete the workout?', {
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

  // Remove workout
  const removeWorkout = async (id: number) => {
    try {
      const response = await deleteWorkoutAction(id);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);

      // Close dialog if the deleted workout was selected
      setSelectedWorkout((current) => (current?.id === id ? null : current));

      router.refresh();
    } catch (error) {
      console.error('Failed to delete workout:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-white">Your workouts</h2>

            <p className="mt-0.5 text-xs text-zinc-500">
              {workouts.length} {workouts.length === 1 ? 'workout' : 'workouts'} total
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
            <Dumbbell className="h-4 w-4 text-orange-400" />
          </div>
        </div>

        {workouts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-250 table-fixed border-collapse">
              {/* Table header */}
              <thead>
                <tr className="border-b border-zinc-800/80">
                  <th className="w-55 px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Workouts</th>

                  <th className="w-55 px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Descriptions</th>

                  <th className="w-75 px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Exercises</th>

                  <th className="w-37.5 px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Created</th>

                  <th className="w-37.5 px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Updated</th>

                  <th className="w-30 px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Actions</th>
                </tr>
              </thead>

              <tbody>
                {workouts.map((workout) => (
                  <tr
                    key={workout.id}
                    className="
                      group border-b border-zinc-800/60
                      transition-colors duration-200
                      last:border-b-0 hover:bg-zinc-800/30
                    "
                  >
                    {/* Workout */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="
                            flex h-11 w-11 shrink-0
                            items-center justify-center
                            rounded-xl border border-orange-500/10
                            bg-orange-500/10 text-orange-400
                            transition-all duration-200
                            group-hover:border-orange-500/20
                            group-hover:bg-orange-500/15
                            group-hover:shadow-lg
                            group-hover:shadow-orange-500/5
                          "
                        >
                          <Dumbbell className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-zinc-100">{workout.name}</p>

                          <p className="mt-1 text-xs text-zinc-600">Workout #{workout.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-5">
                      <p className="truncate text-sm text-zinc-400" title={workout.description ?? undefined}>
                        {workout.description || 'No description'}
                      </p>
                    </td>

                    {/* Exercises */}
                    <td className="px-6 py-5">
                      <div className="flex max-w-md flex-wrap gap-2">
                        {workout.workoutExercises.length > 0 ? (
                          <>
                            {workout.workoutExercises.slice(0, 3).map((exercise) => (
                              <span
                                key={exercise.exerciseId}
                                className="
                                    inline-flex items-center
                                    rounded-lg border border-blue-500/20
                                    bg-blue-500/10 px-2.5 py-1.5
                                    text-xs font-medium text-blue-400
                                  "
                              >
                                {exercise.name}
                              </span>
                            ))}

                            {workout.workoutExercises.length > 3 && (
                              <button
                                type="button"
                                onClick={() => setSelectedWorkout(workout)}
                                aria-label={`Show all exercises for ${workout.name}`}
                                className="
                                  inline-flex cursor-pointer
                                  items-center rounded-lg
                                  border border-zinc-700
                                  bg-zinc-800/60 px-2.5 py-1.5
                                  text-xs font-medium text-zinc-400
                                  transition-colors
                                  hover:border-blue-500/40
                                  hover:bg-blue-500/10
                                  hover:text-blue-400
                                "
                              >
                                +{workout.workoutExercises.length - 3} more
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-zinc-600">No exercises</span>
                        )}
                      </div>
                    </td>

                    {/* Created */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <CalendarDays className="h-4 w-4 text-amber-600" />

                        {new Date(workout.createdAt).toLocaleDateString('sv-SE')}
                      </div>
                    </td>

                    {/* Updated */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <CalendarDays className="h-4 w-4 text-amber-600" />

                        {new Date(workout.updatedAt).toLocaleDateString('sv-SE')}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        {/* Edit */}
                        <Link
                          href={`/workout/edit/${workout.id}`}
                          aria-label={`Edit ${workout.name}`}
                          className="
                            flex h-9 w-9 items-center justify-center
                            rounded-lg border border-zinc-700
                            bg-zinc-800/60 text-orange-500
                            transition-all duration-200
                            hover:border-orange-500/40
                            hover:bg-orange-500/10
                            hover:text-orange-400
                          "
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDelete(workout.id)}
                          aria-label={`Delete ${workout.name}`}
                          className="
                            flex h-9 w-9 cursor-pointer
                            items-center justify-center
                            rounded-lg border border-zinc-700
                            bg-zinc-800/60 text-red-400
                            transition-all duration-200
                            hover:border-red-500/40
                            hover:bg-red-500/10
                            hover:text-red-400
                          "
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800">
              <Dumbbell className="h-6 w-6 text-zinc-600" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-zinc-300">No workouts yet</h3>

            <p className="mt-1 max-w-sm text-sm text-zinc-600">Create your first workout to start building your workout library.</p>
          </div>
        )}
      </div>

      {/* All exercises dialog */}
      {selectedWorkout && (
        <div
          className="
            fixed inset-0 z-50 flex items-center
            justify-center bg-black/70 p-4 backdrop-blur-sm
          "
          onClick={() => setSelectedWorkout(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="workout-dialog-title"
            className="
              w-full max-w-lg overflow-hidden rounded-2xl
              border border-zinc-800
              bg-gradient-to-br from-zinc-900 to-zinc-950
              shadow-2xl
            "
            onClick={(event) => event.stopPropagation()}
          >
            {/* Dialog header */}
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
                  transition-colors hover:bg-zinc-800
                  hover:text-white
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* All exercises */}
            <div className="max-h-[60vh] space-y-2 overflow-y-auto p-6">
              {selectedWorkout.workoutExercises.map((exercise, index) => (
                <div
                  key={exercise.exerciseId}
                  className="
                      flex items-center gap-3 rounded-xl
                      border border-zinc-800
                      bg-zinc-800/40 p-3
                    "
                >
                  <span
                    className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-lg bg-blue-500/10
                        text-sm font-semibold text-blue-400
                      "
                  >
                    {index + 1}
                  </span>

                  <span className="text-sm font-medium text-zinc-200">{exercise.name}</span>
                </div>
              ))}
            </div>

            {/* Dialog footer */}
            <div className="border-t border-zinc-800 px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedWorkout(null)}
                className="
                  w-full cursor-pointer rounded-xl
                  bg-zinc-800 px-4 py-2.5
                  text-sm font-medium text-white
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
