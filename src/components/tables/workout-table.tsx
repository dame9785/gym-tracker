'use client';

import { CalendarDays, Dumbbell, Pencil, Trash2 } from 'lucide-react';
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

  // Handle delete
  const handleDelete = (id: number) => {
    verifyDelete(id);
  };

  // Verify delete
  const verifyDelete = (id: number): void => {
    toast('Are you sure you want to delete the exercise?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          await removeExercise(id);
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  // Remove exercise
  const removeExercise = async (id: number) => {
    try {
      const response = await deleteWorkoutAction(id);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete workout:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-white">Your workouts</h2>

          <p className="mt-0.5 text-xs text-zinc-500">
            {workouts.length} {workouts.length === 1 ? 'träningspass' : 'träningspass'} total
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
          <Dumbbell className="h-4 w-4 text-orange-400" />
        </div>
      </div>

      {workouts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] table-fixed border-collapse">
            {/* Table header */}
            <thead>
              <tr className="border-b border-zinc-800/80">
                <th className="w-[220px] px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Workouts</th>
                <th className="w-[220px] px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Descriptions</th>
                <th className="w-[300px] px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Exericses</th>
                <th className="w-[150px] px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Created</th>
                <th className="w-[150px] px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Updated</th>
                <th className="w-[120px] px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Measures</th>
              </tr>
            </thead>

            <tbody>
              {workouts.map((workout) => (
                <tr
                  key={workout.id}
                  className="
                    group
                    border-b border-zinc-800/60
                    last:border-b-0
                    transition-colors duration-200
                    hover:bg-zinc-800/30
                  "
                >
                  {/* Workout */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          flex h-11 w-11 shrink-0
                          items-center justify-center
                          rounded-xl
                          border border-orange-500/10
                          bg-orange-500/10
                          text-orange-400
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
                                inline-flex
                                items-center
                                rounded-lg
                                border border-blue-500/20
                                bg-blue-500/10
                                px-2.5 py-1.5
                                text-xs font-medium
                                text-blue-400
                              "
                            >
                              {exercise.name}
                            </span>
                          ))}

                          {workout.workoutExercises.length > 3 && (
                            <span
                              className="
                                inline-flex
                                items-center
                                rounded-lg
                                border border-zinc-700
                                bg-zinc-800/60
                                px-2.5 py-1.5
                                text-xs font-medium
                                text-zinc-500
                              "
                            >
                              +{workout.workoutExercises.length - 3} more
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-zinc-600">No workouts</span>
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
                        aria-label={`Redigera ${workout.name}`}
                        className="
                          flex h-9 w-9
                          items-center justify-center
                          rounded-lg
                          border border-zinc-700
                          bg-zinc-800/60
                          text-zinc-500
                          transition-all duration-200
                          hover:border-blue-500/40
                          hover:bg-blue-500/10
                          hover:text-blue-400
                        "
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete(workout.id)}
                        aria-label={`Radera ${workout.name}`}
                        className="
                        cursor-pointer
                          flex h-9 w-9
                          items-center justify-center
                          rounded-lg
                          border border-zinc-700
                          bg-zinc-800/60
                          text-zinc-500
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
          <h3 className="mt-4 text-base font-semibold text-zinc-300">No training sessions yet</h3>
          <p className="mt-1 max-w-sm text-sm text-zinc-600">Create your first workout to start building your workout library.</p>
        </div>
      )}
    </div>
  );
}
