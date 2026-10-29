import type { WorkoutViewModel, WorkoutSessionViewModel } from '@/types/workout-types';

interface Props {
  workout: WorkoutViewModel;
  session: WorkoutSessionViewModel | null;
  previousSessions: WorkoutSessionViewModel[];
}

type ProgressStatus = 'improved' | 'unchanged' | 'lower' | 'missing';

function getProgressStatus(current: number | null, previous: number | null, higherIsBetter = true): ProgressStatus {
  if (current === null || previous === null) {
    return 'missing';
  }

  if (current === previous) {
    return 'unchanged';
  }

  const improved = higherIsBetter ? current > previous : current < previous;

  return improved ? 'improved' : 'lower';
}

export default function WorkoutDetails({ workout, session, previousSessions }: Props) {
  const exercises = [...workout.workoutExercises].sort((a, b) => a.order - b.order);

  const totalSets = exercises.reduce((total, exercise) => total + exercise.sets, 0);

  const totalExercises = exercises.length;

  const totalSeconds = exercises.reduce((total, exercise) => total + (exercise.seconds ?? 0) * exercise.sets, 0);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) return `${remainingSeconds} sek`;
    if (remainingSeconds === 0) return `${minutes} min`;

    return `${minutes} min ${remainingSeconds} sek`;
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Okänt datum';

    return new Intl.DateTimeFormat('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const sessionExercises = session?.exercises ?? [];

  const getCompletedReps = (exercise: WorkoutSessionViewModel['exercises'][number] | undefined): number | null => {
    const completedSets = (exercise?.sets ?? []).filter((set) => set.completed);

    if (completedSets.length === 0 || completedSets.some((set) => set.actualReps === null)) {
      return null;
    }

    return completedSets.reduce((total, set) => total + set.actualReps!, 0);
  };

  const getCompletedSeconds = (exercise: WorkoutSessionViewModel['exercises'][number] | undefined): number | null => {
    const completedSets = (exercise?.sets ?? []).filter((set) => set.completed);

    if (completedSets.length === 0 || completedSets.some((set) => set.actualSeconds === null)) {
      return null;
    }

    return completedSets.reduce((total, set) => total + set.actualSeconds!, 0);
  };

  const getAverageWeight = (exercise: WorkoutSessionViewModel['exercises'][number] | undefined): number | null => {
    const completedSets = (exercise?.sets ?? []).filter((set) => set.completed);

    if (completedSets.length === 0) {
      return null;
    }

    const setsWithWeight = completedSets.filter((set) => set.actualWeight !== null);

    if (setsWithWeight.length === 0) {
      return null;
    }

    return setsWithWeight.reduce((total, set) => total + (set.actualWeight ?? 0), 0) / setsWithWeight.length;
  };

  return (
    <section className="mx-auto w-full max-w-5xl space-y-8 pb-10">
      <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/15 via-zinc-900 to-zinc-950 p-6 shadow-2xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Workout overview</p>
          </div>

          <h1 className="max-w-3xl break-words text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">{workout.name}</h1>

          {workout.description ? (
            <p className="mt-4 max-w-2xl whitespace-pre-line text-sm leading-7 text-zinc-400 sm:text-base">{workout.description}</p>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">Inga detaljer har lagts till för det här träningspasset ännu.</p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
              ⚡ {totalExercises} {totalExercises === 1 ? 'övning' : 'övningar'}
            </span>

            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300">
              ↻ {totalSets} set totalt
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard title="Övningar" value={String(totalExercises)} />
        <StatCard title="Planerade set" value={String(totalSets)} />
        <StatCard title="Total tid för tidsövningar" value={totalSeconds > 0 ? formatDuration(totalSeconds) : '—'} />
      </div>

      <div>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-400">Ditt upplägg</p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Övningar</h2>
          </div>

          <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-400">{totalExercises} totalt</span>
        </div>

        {exercises.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
            <p className="text-base font-semibold text-zinc-300">Inga övningar ännu</p>
            <p className="mt-2 text-sm text-zinc-500">Lägg till övningar för att bygga ditt träningspass.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {exercises.map((exercise, index) => {
              const sessionExercise = sessionExercises.find((item) => item.exerciseId === exercise.exerciseId);

              const exerciseSets = sessionExercise?.sets ?? [];
              const exerciseCompletedSets = exerciseSets.filter((set) => set.completed);

              const exerciseActualReps = exerciseCompletedSets.reduce((total, set) => total + (set.actualReps ?? 0), 0);

              const exerciseActualSeconds = exerciseCompletedSets.reduce((total, set) => total + (set.actualSeconds ?? 0), 0);

              const previousSessionWithExercise = previousSessions.find((previousSession) =>
                previousSession.exercises.some((item) => item.exerciseId === exercise.exerciseId && item.sets.some((set) => set.completed)),
              );

              const previousSessionExercise = previousSessionWithExercise?.exercises.find(
                (item) => item.exerciseId === exercise.exerciseId && item.sets.some((set) => set.completed),
              );

              const currentAverageWeight = getAverageWeight(sessionExercise);
              const previousAverageWeight = getAverageWeight(previousSessionExercise);

              const previousReps = previousSessionExercise ? getCompletedReps(previousSessionExercise) : null;

              const previousSeconds = previousSessionExercise ? getCompletedSeconds(previousSessionExercise) : null;

              const currentReps = getCompletedReps(sessionExercise);
              const currentSeconds = getCompletedSeconds(sessionExercise);

              const repsStatus = getProgressStatus(currentReps, previousReps);
              const weightStatus = getProgressStatus(currentAverageWeight, previousAverageWeight);
              const secondsStatus = getProgressStatus(currentSeconds, previousSeconds, true);

              const statuses = [repsStatus, weightStatus, secondsStatus];
              const comparableCount = statuses.filter((status) => status !== 'missing').length;

              const improvedCount = statuses.filter((status) => status === 'improved').length;

              const lowerCount = statuses.filter((status) => status === 'lower').length;

              const unchangedCount = statuses.filter((status) => status === 'unchanged').length;

              const summary = comparableCount === 0 ? 'Ingen jämförbar data' : `${improvedCount} av ${comparableCount} mätvärden förbättrade`;

              return (
                <article
                  key={`${exercise.exerciseId}-${exercise.order}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 transition duration-200 hover:border-blue-400/30 hover:bg-zinc-900"
                >
                  <div className="flex items-start gap-4 p-4 sm:gap-5 sm:p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/10 text-sm font-extrabold text-blue-300 sm:h-14 sm:w-14">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="break-words text-base font-bold text-white sm:text-lg">{exercise.name}</h3>
                          {session && (
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                                  comparableCount === 0
                                    ? 'border-white/10 bg-white/5 text-zinc-400'
                                    : lowerCount > 0
                                      ? 'border-amber-400/20 bg-amber-400/10 text-amber-300'
                                      : improvedCount > 0
                                        ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                                        : 'border-white/10 bg-white/5 text-zinc-300'
                                }`}
                              >
                                {comparableCount === 0 ? '—' : lowerCount > 0 ? '↓' : improvedCount > 0 ? '↑' : '—'} {summary}
                              </span>

                              {unchangedCount > 0 && comparableCount > 0 && <span className="text-xs text-zinc-500">{unchangedCount} oförändrade</span>}

                              {lowerCount > 0 && <span className="text-xs text-amber-300">{lowerCount} lägre</span>}
                            </div>
                          )}
                          <p className="mt-0.5 text-xs text-zinc-500">
                            Övning {index + 1} av {totalExercises}
                          </p>
                        </div>

                        <span className="w-fit shrink-0 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-zinc-400">
                          {exercise.sets} set planerade
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {exercise.reps != null && (
                          <span className="rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-zinc-300">
                            <span className="text-zinc-500">Reps:</span> <span className="font-semibold text-white">{exercise.reps}</span>
                          </span>
                        )}

                        {exercise.weight != null ? (
                          <span className="rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-zinc-300">
                            <span className="text-zinc-500">Planerad vikt:</span> <span className="font-semibold text-white">{exercise.weight} kg</span>
                          </span>
                        ) : (
                          <span className="rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-zinc-400">Kroppsvikt / ej angivet</span>
                        )}

                        {exercise.seconds != null && (
                          <span className="rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-zinc-300">
                            <span className="text-zinc-500">Tid:</span> <span className="font-semibold text-white">{formatDuration(exercise.seconds)}</span>
                          </span>
                        )}

                        <span className="rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-zinc-300">
                          <span className="text-zinc-500">Set:</span> <span className="font-semibold text-white">{exercise.sets}</span>
                        </span>
                      </div>

                      {session && sessionExercise && (
                        <div className="mt-3 rounded-xl border border-emerald-400/15 bg-emerald-500/[0.05] p-3">
                          <div className="mb-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Resultat från senaste passet</p>
                            <p className="mt-0.5 text-xs text-zinc-500">Dina faktiskt registrerade träningsresultat</p>
                          </div>

                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <ValueCard title="Utförda repetitioner" value={`${exerciseActualReps} reps`} actual />

                            <ValueCard
                              title="Vikt per set"
                              value={
                                exerciseCompletedSets.length > 0
                                  ? exerciseCompletedSets.map((set) => (set.actualWeight !== null ? `${set.actualWeight} kg` : 'Ej angiven')).join(' · ')
                                  : 'Inga slutförda set'
                              }
                              actual
                            />

                            <ValueCard
                              title="Total arbetstid"
                              value={exerciseActualSeconds > 0 ? formatDuration(exerciseActualSeconds) : 'Ingen tid registrerad'}
                              actual
                            />
                          </div>
                        </div>
                      )}
                      {session && (
                        <div className="mt-3 rounded-xl border border-blue-400/15 bg-blue-500/[0.05] p-3">
                          <div className="mb-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-blue-400">Progression</p>
                            <p className="mt-0.5 text-xs text-zinc-500">
                              {previousSessionWithExercise
                                ? `Senast utförd: ${formatDate(previousSessionWithExercise.finishedAt)}`
                                : 'Ingen tidigare registrering av övningen'}
                            </p>
                          </div>

                          {!previousSessionExercise ? (
                            <p className="text-sm text-zinc-300">Ingen tidigare registrering av övningen.</p>
                          ) : (
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                              <ProgressCard title="Repetitioner" current={getCompletedReps(sessionExercise)} previous={previousReps} unit="reps" />

                              <ProgressCard title="Genomsnittlig vikt" current={currentAverageWeight} previous={previousAverageWeight} unit="kg" />

                              <ProgressCard
                                title="Arbetstid"
                                current={getCompletedSeconds(sessionExercise)}
                                previous={previousSeconds}
                                unit="sek"
                                higherIsBetter={true}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

                  <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
                    <span className="text-xs text-zinc-500">
                      Övning {index + 1} av {totalExercises}
                    </span>

                    {exercise.seconds != null && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        Tidsbaserad
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 sm:p-5">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs font-medium text-zinc-500 sm:text-sm">{title}</p>
    </div>
  );
}

function ValueCard({ title, value, actual = false }: { title: string; value: string; actual?: boolean }) {
  return (
    <div className="rounded-lg border border-white/5 bg-black/20 p-2.5">
      <p className={`text-[10px] font-bold uppercase tracking-wider ${actual ? 'text-emerald-400/80' : 'text-zinc-500'}`}>{title}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-200">{value}</p>
    </div>
  );
}

function ProgressCard({
  title,
  current,
  previous,
  unit,
  higherIsBetter = true,
}: {
  title: string;
  current: number | null;
  previous: number | null;
  unit: string;
  higherIsBetter?: boolean;
}) {
  const formatValue = (value: number) => (Number.isInteger(value) ? String(value) : value.toLocaleString('sv-SE'));

  if (current === null || previous === null) {
    return (
      <div className="rounded-lg border border-white/5 bg-black/20 p-2.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{title}</p>
        <p className="mt-1.5 text-sm font-semibold text-zinc-400">Otillräckliga data</p>
      </div>
    );
  }

  const difference = Number((current - previous).toFixed(2));
  const unchanged = difference === 0;

  const improved = higherIsBetter ? difference > 0 : difference < 0;

  const status = unchanged
    ? {
        label: 'Oförändrat',
        color: 'text-zinc-300',
        icon: '—',
      }
    : {
        label: improved ? 'Förbättring' : 'Lägre resultat',
        color: improved ? 'text-emerald-400' : 'text-amber-400',
        icon: improved ? '↑' : '↓',
      };

  return (
    <div className="rounded-lg border border-white/5 bg-black/20 p-2.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{title}</p>

      <p className={`mt-2 text-sm font-bold ${status.color}`}>
        {status.icon} {status.label}
      </p>

      <p className="mt-1.5 text-sm text-zinc-300">
        Skillnad: {unchanged ? '0' : `${difference > 0 ? '+' : '−'}${formatValue(Math.abs(difference))}`} {unit}
      </p>

      <p className="mt-0.5 text-xs text-zinc-500">
        Nu: {formatValue(current)} {unit}
      </p>

      <p className="mt-0.5 text-xs text-zinc-500">
        Föregående: {formatValue(previous)} {unit}
      </p>
    </div>
  );
}
