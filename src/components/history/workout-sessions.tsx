'use client';

import { useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, Dumbbell, Layers3, ChevronDown, ChevronUp, Timer, Weight, Repeat2, XCircle } from 'lucide-react';

import { WorkoutSessionWithExercisesViewModel } from '@/types/history-types';

type Props = {
  workoutSessions: WorkoutSessionWithExercisesViewModel[];
};

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) return `${remainingSeconds} sec`;
  if (remainingSeconds === 0) return `${minutes} min`;

  return `${minutes} min ${remainingSeconds} sec`;
}

export default function WorkoutSessions({ workoutSessions }: Props) {
  const [expandedSessions, setExpandedSessions] = useState<number[]>([]);

  const toggleSession = (sessionId: number) => {
    setExpandedSessions((current) => (current.includes(sessionId) ? current.filter((id) => id !== sessionId) : [...current, sessionId]));
  };

  return (
    <section className="mt-10 min-w-0">
      {/* Section header */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-white">Workout History</h2>
        <p className="mt-1 text-sm text-zinc-400">Your recent training sessions</p>
      </div>

      {/* Empty state */}
      {workoutSessions.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 text-center">
          <Dumbbell className="mx-auto mb-4 h-10 w-10 text-zinc-600" />
          <h3 className="text-lg font-semibold text-white">No workouts yet</h3>
          <p className="mt-2 text-sm text-zinc-500">Your training sessions will appear here.</p>
        </div>
      ) : (
        /* Responsive workout grid */
        <div className="grid w-full min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {workoutSessions.map((session) => {
            const isCompleted = session.status === 'COMPLETED';

            const sessionDate = new Date(session.finishedAt ?? session.startedAt);

            const formattedDate = sessionDate.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });

            const formattedTime = sessionDate.toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            });

            const durationInSeconds =
              session.startedAt && session.finishedAt
                ? Math.max(0, Math.floor((new Date(session.finishedAt).getTime() - new Date(session.startedAt).getTime()) / 1000))
                : 0;

            const durationMinutes = Math.floor(durationInSeconds / 60);

            const totalSets = session.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);

            const completedSets = session.exercises.reduce((total, exercise) => total + exercise.sets.filter((set) => set.completed).length, 0);

            const actualSeconds = session.exercises.reduce(
              (total, exercise) => total + exercise.sets.reduce((setTotal, set) => setTotal + (set.completed ? (set.actualSeconds ?? 0) : 0), 0),
              0,
            );

            const isExpanded = expandedSessions.includes(session.id);

            return (
              <article
                key={session.id}
                className="group flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 transition-all duration-200 hover:border-orange-500/40 hover:bg-zinc-900"
              >
                {/* Session header */}
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="flex flex-col gap-3">
                    {/* Workout title and icon */}
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="shrink-0 rounded-xl bg-orange-500/10 p-2.5 sm:p-3">
                        <Dumbbell className="h-5 w-5 text-orange-500 sm:h-6 sm:w-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-base font-bold leading-snug text-white transition-colors group-hover:text-orange-400 sm:text-lg">
                          {session.workoutName}
                        </h3>

                        {/* Date and time */}
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400">
                          <CalendarDays className="h-4 w-4 shrink-0" />
                          <span>
                            {formattedDate} • {formattedTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div
                      className={`flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 ${
                        isCompleted ? 'border-green-500/20 bg-green-500/10' : 'border-red-500/20 bg-red-500/10'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> : <XCircle className="h-3.5 w-3.5 text-red-400" />}

                      <span className={`text-[10px] font-semibold tracking-wide ${isCompleted ? 'text-green-400' : 'text-red-400'}`}>{session.status}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {session.workoutDescription && <p className="mt-4 line-clamp-2 break-words text-sm leading-relaxed text-zinc-400">{session.workoutDescription}</p>}

                  {/* Session stats */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="min-w-0 rounded-xl bg-zinc-800/70 px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 shrink-0 text-orange-500" />
                        <span className="text-sm font-semibold text-white">{durationMinutes} min</span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">Duration</p>
                    </div>

                    <div className="min-w-0 rounded-xl bg-zinc-800/70 px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="h-4 w-4 shrink-0 text-orange-500" />
                        <span className="text-sm font-semibold text-white">{session.exercises.length}</span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">Exercises</p>
                    </div>

                    <div className="min-w-0 rounded-xl bg-zinc-800/70 px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Layers3 className="h-4 w-4 shrink-0 text-orange-500" />
                        <span className="text-sm font-semibold text-white">
                          {completedSets}/{totalSets}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">Completed sets</p>
                    </div>

                    <div className="min-w-0 rounded-xl bg-zinc-800/70 px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 shrink-0 text-orange-500" />
                        <span className="truncate text-sm font-semibold text-white">{actualSeconds > 0 ? formatDuration(actualSeconds) : '—'}</span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">Work time</p>
                    </div>
                  </div>

                  {/* Expand button */}
                  <div className="mt-auto pt-5">
                    <button
                      type="button"
                      onClick={() => toggleSession(session.id)}
                      aria-expanded={isExpanded}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-3 py-3 text-sm font-semibold text-zinc-300 transition hover:border-orange-500/40 hover:bg-orange-500/5 hover:text-orange-400"
                    >
                      {isExpanded ? (
                        <>
                          Hide set results
                          <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Show exercises and sets
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Exercise and set details */}
                {isExpanded && (
                  <div className="space-y-4 border-t border-zinc-800 bg-black/10 p-3 sm:p-4">
                    {session.exercises
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((exercise, exerciseIndex) => (
                        <div key={exercise.id} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70">
                          <div className="flex items-start gap-3 p-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-xs font-bold text-orange-400">
                              {String(exerciseIndex + 1).padStart(2, '0')}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="break-words text-sm font-semibold text-white">{exercise.name}</h4>

                              {exercise.primaryMuscle && <p className="mt-1 text-xs text-zinc-500">{exercise.primaryMuscle}</p>}
                            </div>

                            <span className="shrink-0 rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-400">{exercise.sets.length} sets</span>
                          </div>

                          <div className="space-y-2 px-3 pb-3">
                            {exercise.sets
                              .slice()
                              .sort((a, b) => a.setNumber - b.setNumber)
                              .map((set) => (
                                <div
                                  key={set.id}
                                  className={`rounded-lg border p-3 ${set.completed ? 'border-green-500/20 bg-green-500/[0.04]' : 'border-red-500/20 bg-red-500/[0.03]'}`}
                                >
                                  <div className="mb-3 flex items-center justify-between gap-2">
                                    <span className="text-xs font-semibold text-zinc-300">Set {set.setNumber}</span>

                                    {set.completed ? (
                                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Completed
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400">
                                        <XCircle className="h-3.5 w-3.5" />
                                        Not completed
                                      </span>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-3 gap-2">
                                    <div className="min-w-0 rounded-lg bg-zinc-800/60 p-2">
                                      <div className="mb-1 flex items-center gap-1.5 text-zinc-500">
                                        <Repeat2 className="h-3.5 w-3.5 shrink-0" />
                                        <span className="text-[10px] uppercase tracking-wide">Reps</span>
                                      </div>
                                      <p className="text-sm font-bold text-white">{set.actualReps ?? '—'}</p>
                                    </div>

                                    <div className="min-w-0 rounded-lg bg-zinc-800/60 p-2">
                                      <div className="mb-1 flex items-center gap-1.5 text-zinc-500">
                                        <Weight className="h-3.5 w-3.5 shrink-0" />
                                        <span className="text-[10px] uppercase tracking-wide">Weight</span>
                                      </div>
                                      <p className="break-words text-sm font-bold text-white">{set.actualWeight != null ? `${set.actualWeight} kg` : '—'}</p>
                                    </div>

                                    <div className="min-w-0 rounded-lg bg-zinc-800/60 p-2">
                                      <div className="mb-1 flex items-center gap-1.5 text-zinc-500">
                                        <Timer className="h-3.5 w-3.5 shrink-0" />
                                        <span className="text-[10px] uppercase tracking-wide">Seconds</span>
                                      </div>
                                      <p className="break-words text-sm font-bold text-white">{set.actualSeconds != null ? formatDuration(set.actualSeconds) : '—'}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
