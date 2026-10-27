'use client';

import { useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, Dumbbell, Layers3, ChevronDown, ChevronUp, Timer, Weight, Repeat2 } from 'lucide-react';

import { WorkoutSessionWithExercisesViewModel } from '@/types/history-types';

type Props = {
  workoutSessions: WorkoutSessionWithExercisesViewModel[];
};

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) return `${remainingSeconds} sek`;
  if (remainingSeconds === 0) return `${minutes} min`;

  return `${minutes} min ${remainingSeconds} sek`;
}

export default function WorkoutSessions({ workoutSessions }: Props) {
  const [expandedSessions, setExpandedSessions] = useState<number[]>([]);

  const toggleSession = (sessionId: number) => {
    setExpandedSessions((current) => (current.includes(sessionId) ? current.filter((id) => id !== sessionId) : [...current, sessionId]));
  };

  return (
    <section className="mt-10">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-white">Completed Workouts</h2>
        <p className="mt-1 text-sm text-zinc-400">Your recently completed training sessions</p>
      </div>

      {workoutSessions.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 text-center">
          <Dumbbell className="mx-auto mb-4 h-10 w-10 text-zinc-600" />
          <h3 className="text-lg font-semibold text-white">No completed workouts yet</h3>
          <p className="mt-2 text-sm text-zinc-500">Your completed workouts will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {workoutSessions.map((session) => {
            const formattedDate = session.finishedAt
              ? new Date(session.finishedAt).toLocaleString('sv-SE', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Okänt datum';

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
                className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 transition-all duration-200 hover:border-orange-500/40 hover:bg-zinc-900"
              >
                {/* Session header */}
                <div className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-orange-500/10 p-3">
                        <Dumbbell className="h-6 w-6 text-orange-500" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="break-words text-lg font-bold text-white transition-colors group-hover:text-orange-400">{session.workoutName}</h3>

                        <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                          <CalendarDays className="h-4 w-4 shrink-0" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-fit items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span className="text-xs font-semibold tracking-wide text-green-400">{session.status}</span>
                    </div>
                  </div>

                  {session.workoutDescription && <p className="mt-4 text-sm leading-relaxed text-zinc-400">{session.workoutDescription}</p>}

                  {/* Session stats */}
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl bg-zinc-800/70 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-semibold text-white">{durationMinutes} min</span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">Total duration</p>
                    </div>

                    <div className="rounded-xl bg-zinc-800/70 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-semibold text-white">{session.exercises.length}</span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">Exercises</p>
                    </div>

                    <div className="rounded-xl bg-zinc-800/70 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Layers3 className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-semibold text-white">
                          {completedSets}/{totalSets}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">Completed sets</p>
                    </div>

                    <div className="rounded-xl bg-zinc-800/70 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-semibold text-white">{actualSeconds > 0 ? formatDuration(actualSeconds) : '—'}</span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">Actual work time</p>
                    </div>
                  </div>

                  {/* Expand button */}
                  <button
                    type="button"
                    onClick={() => toggleSession(session.id)}
                    aria-expanded={isExpanded}
                    className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:border-orange-500/40 hover:bg-orange-500/5 hover:text-orange-400"
                  >
                    {isExpanded ? (
                      <>
                        Dölj setresultat
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Visa övningar och setresultat
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Exercise and set details */}
                {isExpanded && (
                  <div className="space-y-4 border-t border-zinc-800 bg-black/10 p-4 sm:p-5">
                    {session.exercises
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((exercise, exerciseIndex) => (
                        <div key={exercise.id} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70">
                          <div className="flex items-start gap-3 p-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-xs font-bold text-orange-400">
                              {String(exerciseIndex + 1).padStart(2, '0')}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="break-words font-semibold text-white">{exercise.name}</h4>

                              {exercise.primaryMuscle && <p className="mt-1 text-xs text-zinc-500">{exercise.primaryMuscle}</p>}
                            </div>

                            <span className="shrink-0 rounded-lg bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
                              {exercise.sets.length} {exercise.sets.length === 1 ? 'set' : 'set'}
                            </span>
                          </div>

                          <div className="space-y-2 px-3 pb-3">
                            {exercise.sets
                              .slice()
                              .sort((a, b) => a.setNumber - b.setNumber)
                              .map((set) => (
                                <div
                                  key={set.id}
                                  className={`rounded-lg border p-3 ${set.completed ? 'border-green-500/20 bg-green-500/[0.04]' : 'border-zinc-800 bg-black/20'}`}
                                >
                                  <div className="mb-3 flex items-center justify-between gap-2">
                                    <span className="text-xs font-semibold text-zinc-300">Set {set.setNumber}</span>

                                    {set.completed ? (
                                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Genomfört
                                      </span>
                                    ) : (
                                      <span className="text-xs text-zinc-500">Ej genomfört</span>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-3 gap-2">
                                    <div className="rounded-lg bg-zinc-800/60 p-2.5">
                                      <div className="mb-1 flex items-center gap-1.5 text-zinc-500">
                                        <Repeat2 className="h-3.5 w-3.5" />
                                        <span className="text-[10px] uppercase tracking-wide">Reps</span>
                                      </div>
                                      <p className="text-sm font-bold text-white">{set.actualReps ?? '—'}</p>
                                    </div>

                                    <div className="rounded-lg bg-zinc-800/60 p-2.5">
                                      <div className="mb-1 flex items-center gap-1.5 text-zinc-500">
                                        <Weight className="h-3.5 w-3.5" />
                                        <span className="text-[10px] uppercase tracking-wide">Vikt</span>
                                      </div>
                                      <p className="text-sm font-bold text-white">{set.actualWeight != null ? `${set.actualWeight} kg` : '—'}</p>
                                    </div>

                                    <div className="rounded-lg bg-zinc-800/60 p-2.5">
                                      <div className="mb-1 flex items-center gap-1.5 text-zinc-500">
                                        <Timer className="h-3.5 w-3.5" />
                                        <span className="text-[10px] uppercase tracking-wide">Sekunder</span>
                                      </div>
                                      <p className="text-sm font-bold text-white">{set.actualSeconds != null ? formatDuration(set.actualSeconds) : '—'}</p>
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
