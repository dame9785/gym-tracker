'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!selectedWorkout) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedWorkout(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedWorkout]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredWorkouts = workouts.filter((workout) => {
    return workout.name.toLowerCase().includes(normalizedQuery) || (workout.description ?? '').toLowerCase().includes(normalizedQuery) || workout.workoutExercises.some((exercise) => exercise.name.toLowerCase().includes(normalizedQuery));
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
            <h2 className="text-text text-lg font-semibold tracking-tight">Your workouts</h2>

            <p className="text-text-muted mt-1 text-sm">
              {workouts.length} {workouts.length === 1 ? 'workout' : 'workouts'} on this page
            </p>
          </div>

          <div className="border-info/15 bg-info/10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border">
            <Dumbbell className="text-info h-5 w-5" />
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label htmlFor="workout-search" className="sr-only">
            Search workouts
          </label>

          <div className="border-border bg-surface/70 focus-within:border-info/50 focus-within:ring-info/10 flex min-w-0 items-center gap-3 rounded-xl border px-4 transition-colors focus-within:ring-2">
            <Search className="text-text-muted h-5 w-5 shrink-0" />

            <input id="workout-search" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search workouts or exercises..." className="text-text placeholder:text-text-muted h-12 w-full min-w-0 bg-transparent text-base outline-none" />

            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search" className="text-text-muted hover:bg-surface-hover hover:text-text flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-text-muted text-xs sm:text-sm">
              Showing {filteredWorkouts.length} of {workouts.length} workouts
            </p>
          </div>
        </div>

        {/* Workout cards */}
        {filteredWorkouts.length > 0 ? (
          <div className={`grid min-w-0 gap-3 sm:gap-4 ${filteredWorkouts.length > 1 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredWorkouts.map((workout) => (
              <article key={workout.id} className="group border-border bg-surface/60 hover:border-info/30 hover:bg-surface flex min-w-0 flex-col overflow-hidden rounded-2xl border transition-all duration-200 hover:shadow-xl hover:shadow-black/20">
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  {/* Card header */}
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="border-info/15 bg-info/10 text-info flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border sm:h-12 sm:w-12">
                        <Dumbbell className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-text text-base font-semibold break-words sm:text-lg">{workout.name}</h3>

                        <p className="text-text-muted mt-0.5 text-xs">Workout #{workout.id}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-1">
                      <Link href={`/workout/edit/${workout.id}`} aria-label={`Edit ${workout.name}`} title="Edit workout" className="text-text-secondary hover:bg-info/10 hover:text-info flex h-10 w-10 items-center justify-center rounded-xl transition-colors">
                        <Pencil className="h-4 w-4" />
                      </Link>

                      <button type="button" onClick={() => handleDelete(workout.id)} aria-label={`Delete ${workout.name}`} title="Delete workout" className="text-text-muted hover:bg-danger/10 hover:text-danger flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary mt-4 line-clamp-2 min-h-10 text-sm leading-5">{workout.description || 'No description added yet.'}</p>

                  {/* Exercise summary */}
                  <div className="border-border/80 bg-background/20 mt-5 rounded-xl border p-3">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ListChecks className="text-info h-4 w-4" />

                        <h4 className="text-text-secondary text-xs font-semibold tracking-wider uppercase">Exercises</h4>
                      </div>

                      <span className="bg-surface-secondary text-text-secondary rounded-lg px-2.5 py-1 text-xs font-medium">{workout.workoutExercises.length} total</span>
                    </div>

                    {workout.workoutExercises.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {workout.workoutExercises.slice(0, 3).map((exercise) => (
                          <span key={exercise.exerciseId} className="border-info/10 bg-info/[0.07] text-info max-w-full truncate rounded-lg border px-2.5 py-1.5 text-xs font-medium">
                            {exercise.name}
                          </span>
                        ))}

                        {workout.workoutExercises.length > 3 && (
                          <button
                            type="button"
                            onClick={() => setSelectedWorkout(workout)}
                            aria-label={`Show all exercises for ${workout.name}`}
                            className="border-border-hover bg-surface/70 text-text-secondary hover:border-info/30 hover:text-info inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors"
                          >
                            +{workout.workoutExercises.length - 3} more
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-text-muted text-sm">No exercises added yet.</p>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="border-border/80 mt-5 space-y-2 border-t pt-4">
                    <div className="flex items-center gap-2 text-xs">
                      <CalendarDays className="text-text-muted h-3.5 w-3.5 shrink-0" />

                      <span className="text-text-muted">Created</span>

                      <time className="text-text-secondary ml-auto">{new Date(workout.createdAt).toLocaleDateString('en-GB')}</time>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <CalendarDays className="text-text-muted h-3.5 w-3.5 shrink-0" />

                      <span className="text-text-muted">Updated</span>

                      <time className="text-text-secondary ml-auto">{new Date(workout.updatedAt).toLocaleDateString('en-GB')}</time>
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <Link href={`/workout/${workout.id}`} className="border-border/80 text-text-secondary hover:bg-info/[0.05] hover:text-info flex min-h-11 items-center justify-between border-t bg-white/[0.015] px-4 py-3 text-sm font-medium transition-colors sm:px-5">
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
          <div role="dialog" aria-modal="true" aria-labelledby="workout-dialog-title" className="border-border bg-background flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-3xl border shadow-2xl sm:max-h-[80vh] sm:max-w-lg sm:rounded-2xl" onClick={(event) => event.stopPropagation()}>
            {/* Dialog header */}
            <div className="border-border flex shrink-0 items-center justify-between gap-3 border-b px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0">
                <h2 id="workout-dialog-title" className="text-text truncate text-lg font-semibold">
                  {selectedWorkout.name}
                </h2>

                <p className="text-text-muted mt-1 text-sm">
                  {selectedWorkout.workoutExercises.length} {selectedWorkout.workoutExercises.length === 1 ? 'exercise' : 'exercises'}
                </p>
              </div>

              <button type="button" onClick={() => setSelectedWorkout(null)} aria-label="Close dialog" className="text-text-secondary hover:bg-surface-hover hover:text-text flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Exercise list */}
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4 sm:p-6">
              {selectedWorkout.workoutExercises.map((exercise, index) => (
                <div key={exercise.exerciseId} className="border-border bg-surface flex min-w-0 items-center gap-3 rounded-xl border p-3">
                  <span className="bg-info/10 text-info flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold">{String(index + 1).padStart(2, '0')}</span>

                  <span className="text-text min-w-0 text-sm font-medium break-words sm:text-base">{exercise.name}</span>
                </div>
              ))}
            </div>

            {/* Dialog footer */}
            <div className="border-border shrink-0 border-t p-4 sm:px-6">
              <button type="button" onClick={() => setSelectedWorkout(null)} className="bg-surface-secondary text-text hover:bg-surface-hover min-h-11 w-full cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
