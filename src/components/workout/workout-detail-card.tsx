'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarDays, ChevronRight, Dumbbell, Eye, Pencil, Search, Trash2, X, ListChecks } from 'lucide-react';
import { toast } from 'sonner';

import type { WorkoutViewModel } from '@/types/workout-types';
import { deleteWorkoutAction } from '@/actions/workout-actions';
import EmptyState from '@/components/ui/empty-state';
import Button from '@/components/button/button';
import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';

type Props = {
  workouts: WorkoutViewModel[];
};

export default function WorkoutDetailCard({ workouts }: Props) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutViewModel | null>(null);

  // Close modal with Escape key
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

  // Search workouts and exercises
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredWorkouts = workouts.filter((workout) => {
    return workout.name.toLowerCase().includes(normalizedQuery) || (workout.description ?? '').toLowerCase().includes(normalizedQuery) || workout.workoutExercises.some((exercise) => exercise.name.toLowerCase().includes(normalizedQuery));
  });

  // Delete workout confirmation
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
          <div className="border-border bg-surface/70 focus-within:border-info/50 focus-within:ring-info/10 flex min-w-0 items-center gap-3 rounded-xl border px-4 transition-colors focus-within:ring-2">
            <Search className="text-text-muted h-5 w-5 shrink-0" />

            <div className="min-w-0 flex-1">
              <FormField htmlFor="workout-search" label="Search workouts">
                <FormInput id="workout-search" name="workout-search" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search workouts or exercises..." />
              </FormField>
            </div>

            {searchQuery && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setSearchQuery('')} ariaLabel="Clear search" className="!h-9 !w-9 !shrink-0 !rounded-lg !p-0">
                <X className="h-4 w-4" />
              </Button>
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

                      <Button type="button" variant="danger" size="sm" onClick={() => handleDelete(workout.id)} ariaLabel={`Delete ${workout.name}`} className="!h-10 !w-10 !rounded-xl !p-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary mt-4 line-clamp-2 min-h-10 text-sm leading-5">{workout.description || 'No description added yet.'}</p>

                  {/* Exercise summary */}
                  <div className="border-border/80 bg-background/20 mt-5 rounded-xl border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ListChecks className="text-info h-4 w-4" />

                        <h4 className="text-text-secondary text-xs font-semibold tracking-wider uppercase">Exercises</h4>
                      </div>

                      <span className="bg-surface-secondary text-text-secondary rounded-lg px-2.5 py-1 text-xs font-medium">{workout.workoutExercises.length} total</span>
                    </div>

                    {workout.workoutExercises.length > 0 ? (
                      <div className="flex">
                        <Button type="button" variant="secondary" size="sm" onClick={() => setSelectedWorkout(workout)} ariaLabel={`View exercise details for ${workout.name}`} className="!mt-3 !flex !h-10 !w-full !flex-row !items-center !justify-center !gap-2 !rounded-lg">
                          <Eye className="h-4 w-4" />
                          View details
                        </Button>
                      </div>
                    ) : (
                      <p className="text-text-muted mt-3 text-sm">No exercises added yet.</p>
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

      {/* Workout details modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6" onClick={() => setSelectedWorkout(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="workout-dialog-title" className="border-border bg-background flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl" onClick={(event) => event.stopPropagation()}>
            {/* Modal header */}
            <div className="border-border flex shrink-0 items-center justify-between gap-3 border-b p-4 sm:p-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="border-info/20 bg-info/10 text-info flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border">
                  <Dumbbell className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <h2 id="workout-dialog-title" className="text-text truncate text-lg font-semibold sm:text-xl">
                    {selectedWorkout.name}
                  </h2>

                  <p className="text-text-muted mt-1 text-sm">
                    {selectedWorkout.workoutExercises.length} {selectedWorkout.workoutExercises.length === 1 ? 'exercise' : 'exercises'} in this workout
                  </p>
                </div>
              </div>

              <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedWorkout(null)} ariaLabel="Close dialog" className="!h-10 !w-10 !shrink-0 !rounded-xl !p-0">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Exercise list */}
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-text text-sm font-semibold">Exercise overview</h3>

                <span className="text-text-muted text-xs">Training plan</span>
              </div>

              {selectedWorkout.workoutExercises.map((exercise, index) => (
                <article key={`${exercise.exerciseId}-${exercise.order}`} className="border-border bg-surface rounded-xl border p-4">
                  {/* Exercise name */}
                  <div className="mb-4 flex items-center gap-3">
                    <span className="bg-info/10 text-info flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold">{String(index + 1).padStart(2, '0')}</span>

                    <div className="min-w-0">
                      <h4 className="text-text text-sm font-semibold sm:text-base">{exercise.name}</h4>

                      <p className="text-text-muted mt-0.5 text-xs">Exercise {index + 1}</p>
                    </div>
                  </div>

                  {/* Exercise statistics */}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <div className="bg-background/70 rounded-lg p-3">
                      <p className="text-text-muted mb-1 text-xs">Sets</p>

                      <p className="text-text text-base font-semibold">{exercise.sets}</p>
                    </div>

                    {exercise.reps > 0 && (
                      <div className="bg-background/70 rounded-lg p-3">
                        <p className="text-text-muted mb-1 text-xs">Repetitions</p>

                        <p className="text-text text-base font-semibold">{exercise.reps}</p>
                      </div>
                    )}

                    {exercise.seconds > 0 && (
                      <div className="bg-background/70 rounded-lg p-3">
                        <p className="text-text-muted mb-1 text-xs">Duration</p>

                        <p className="text-text text-base font-semibold">{exercise.seconds} sec</p>
                      </div>
                    )}

                    {exercise.weight > 0 && (
                      <div className="bg-background/70 rounded-lg p-3">
                        <p className="text-text-muted mb-1 text-xs">Weight</p>

                        <p className="text-text text-base font-semibold">{exercise.weight} kg</p>
                      </div>
                    )}

                    {exercise.weight === 0 && (
                      <div className="bg-background/70 rounded-lg p-3">
                        <p className="text-text-muted mb-1 text-xs">Resistance</p>

                        <p className="text-text text-sm font-semibold">Bodyweight</p>
                      </div>
                    )}
                  </div>

                  {/* Exercise notes */}
                  {exercise.note && (
                    <div className="border-border mt-3 border-t pt-3">
                      <p className="text-text-muted mb-1 text-xs font-medium">Notes</p>

                      <p className="text-text-secondary text-sm leading-relaxed">{exercise.note}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>

            {/* Modal footer */}
            <div className="border-border shrink-0 border-t p-4 sm:px-6">
              <Button type="button" variant="secondary" size="md" onClick={() => setSelectedWorkout(null)} className="!w-full !rounded-xl">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
