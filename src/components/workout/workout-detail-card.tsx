'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarDays, ChevronRight, Dumbbell, Pencil, Search, Trash2, X, ListChecks } from 'lucide-react';
import { toast } from 'sonner';

import type { WorkoutViewModel } from '@/types/workout-types';
import { deleteWorkoutAction } from '@/actions/workout-actions';
import EmptyState from '@/components/ui/empty-state';

type Props = {
  workouts: WorkoutViewModel[];
};

export default function WorkoutDetailCard({ workouts }: Props) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutViewModel | null>(null);

  const filteredWorkouts = workouts.filter((workout) => {
    const query = searchQuery.trim().toLowerCase();

    return workout.name.toLowerCase().includes(query) || (workout.description ?? '').toLowerCase().includes(query) || workout.workoutExercises.some((exercise) => exercise.name.toLowerCase().includes(query));
  });

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
      <section className="w-full min-w-0">
        {/* Section header */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-white">Your workouts</h2>

            <p className="mt-1 text-sm text-zinc-500">
              {workouts.length} {workouts.length === 1 ? 'workout' : 'workouts'} on this page
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10">
            <Dumbbell className="h-5 w-5 text-blue-400" />
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label htmlFor="workout-search" className="sr-only">
            Search workouts
          </label>

          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 transition-colors focus-within:border-blue-400/50 focus-within:ring-2 focus-within:ring-blue-400/10">
            <Search className="h-5 w-5 shrink-0 text-zinc-500" />

            <input id="workout-search" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search workouts or exercises..." className="h-12 w-full min-w-0 bg-transparent text-base text-white outline-none placeholder:text-zinc-500" />

            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-zinc-500 sm:text-sm">
              Showing {filteredWorkouts.length} of {workouts.length} workouts
            </p>
          </div>
        </div>

        {/* Workout cards */}
        {filteredWorkouts.length > 0 ? (
          <div className={`grid min-w-0 gap-3 sm:gap-4 ${workouts.length > 1 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredWorkouts.map((workout) => (
              <article key={workout.id} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/60 transition-all duration-200 hover:border-blue-400/30 hover:bg-zinc-900 hover:shadow-xl hover:shadow-black/20">
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  {/* Card header */}
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-blue-400 sm:h-12 sm:w-12">
                        <Dumbbell className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-base font-semibold break-words text-white sm:text-lg">{workout.name}</h3>

                        <p className="mt-0.5 text-xs text-zinc-500">Workout #{workout.id}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-1">
                      <Link href={`/workout/edit/${workout.id}`} aria-label={`Edit ${workout.name}`} title="Edit workout" className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 transition-colors hover:bg-blue-500/10 hover:text-blue-400">
                        <Pencil className="h-4 w-4" />
                      </Link>

                      <button type="button" onClick={() => handleDelete(workout.id)} aria-label={`Delete ${workout.name}`} title="Delete workout" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-zinc-400">{workout.description || 'No description added yet.'}</p>

                  {/* Exercise summary */}
                  <div className="mt-5 rounded-xl border border-zinc-800/80 bg-black/20 p-3">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ListChecks className="h-4 w-4 text-blue-400" />

                        <h4 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">Exercises</h4>
                      </div>

                      <span className="rounded-lg bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300">{workout.workoutExercises.length} total</span>
                    </div>

                    {workout.workoutExercises.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {workout.workoutExercises.slice(0, 3).map((exercise) => (
                          <span key={exercise.exerciseId} className="max-w-full truncate rounded-lg border border-blue-400/10 bg-blue-500/[0.07] px-2.5 py-1.5 text-xs font-medium text-blue-300">
                            {exercise.name}
                          </span>
                        ))}

                        {workout.workoutExercises.length > 3 && (
                          <button
                            type="button"
                            onClick={() => setSelectedWorkout(workout)}
                            aria-label={`Show all exercises for ${workout.name}`}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800/70 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-blue-400/30 hover:text-blue-400"
                          >
                            +{workout.workoutExercises.length - 3} more
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-600">No exercises added yet.</p>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="mt-5 space-y-2 border-t border-zinc-800/80 pt-4">
                    <div className="flex items-center gap-2 text-xs">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0 text-zinc-500" />

                      <span className="text-zinc-500">Created</span>

                      <time className="ml-auto text-zinc-400">{new Date(workout.createdAt).toLocaleDateString('sv-SE')}</time>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0 text-zinc-500" />

                      <span className="text-zinc-500">Updated</span>

                      <time className="ml-auto text-zinc-400">{new Date(workout.updatedAt).toLocaleDateString('sv-SE')}</time>
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <Link href={`/workout/${workout.id}`} className="flex min-h-11 items-center justify-between border-t border-zinc-800/80 bg-white/[0.015] px-4 py-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-blue-500/[0.05] hover:text-blue-400 sm:px-5">
                  <span>View workout</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          /* Empty state */
          <EmptyState
            icon={Search}
            title={searchQuery.trim() ? 'No workouts found' : 'No workouts yet'}
            description={searchQuery.trim() ? 'Try another search term.' : 'Create your first workout to start building your workout library.'}
            action={
              searchQuery.trim()
                ? {
                    label: 'Clear search',
                    onClick: () => setSearchQuery(''),
                  }
                : {
                    label: 'Create workout',
                    href: '/workout/register',
                  }
            }
          />
        )}
      </section>

      {/* All exercises dialog */}
      {selectedWorkout && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={() => setSelectedWorkout(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="workout-dialog-title" className="flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-zinc-800 bg-zinc-950 shadow-2xl sm:max-h-[80vh] sm:max-w-lg sm:rounded-2xl" onClick={(event) => event.stopPropagation()}>
            {/* Dialog header */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800 px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0">
                <h2 id="workout-dialog-title" className="truncate text-lg font-semibold text-white">
                  {selectedWorkout.name}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  {selectedWorkout.workoutExercises.length} {selectedWorkout.workoutExercises.length === 1 ? 'exercise' : 'exercises'}
                </p>
              </div>

              <button type="button" onClick={() => setSelectedWorkout(null)} aria-label="Close dialog" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Exercise list */}
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4 sm:p-6">
              {selectedWorkout.workoutExercises.map((exercise, index) => (
                <div key={exercise.exerciseId} className="flex min-w-0 items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-semibold text-blue-400">{String(index + 1).padStart(2, '0')}</span>

                  <span className="min-w-0 text-sm font-medium break-words text-zinc-200 sm:text-base">{exercise.name}</span>
                </div>
              ))}
            </div>

            {/* Dialog footer */}
            <div className="shrink-0 border-t border-zinc-800 p-4 sm:px-6">
              <button type="button" onClick={() => setSelectedWorkout(null)} className="min-h-11 w-full cursor-pointer rounded-xl bg-zinc-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
