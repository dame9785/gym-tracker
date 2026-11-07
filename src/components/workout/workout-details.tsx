import type { WorkoutViewModel, WorkoutSessionViewModel } from '@/types/workout-types';

import { FaDumbbell, FaFire } from 'react-icons/fa';
import { BsClock } from 'react-icons/bs';

import DashboardStatCard from '@/components/dashboard/dashboard-stat-card';

interface Props {
  workout: WorkoutViewModel;
  session: WorkoutSessionViewModel | null;
  previousSessions: WorkoutSessionViewModel[];
}

type ProgressStatus = 'improved' | 'unchanged' | 'lower' | 'missing';

function getProgressStatus(current: number | null, previous: number | null, higherIsBetter = true): ProgressStatus {
  if (current === null || previous === null) return 'missing';
  if (current === previous) return 'unchanged';

  return (higherIsBetter ? current > previous : current < previous) ? 'improved' : 'lower';
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

    if (completedSets.length === 0) return null;

    const setsWithWeight = completedSets.filter((set) => set.actualWeight !== null);

    if (setsWithWeight.length === 0) return null;

    return setsWithWeight.reduce((total, set) => total + (set.actualWeight ?? 0), 0) / setsWithWeight.length;
  };

  // Exactly two exercise cards per row on desktop.
  const exerciseGridClass = 'grid-cols-1 lg:grid-cols-2';

  // Internal information cards adapt to available space.
  const detailsGridClass = 'grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3';

  return (
    <section className="mx-auto w-full min-w-0 space-y-8 pb-10">
      {/* Header */}
      <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/15 via-zinc-900 to-zinc-950 p-6 shadow-2xl sm:p-8">
        <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            <p className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase">Workout overview</p>
          </div>

          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight break-words text-white sm:text-4xl lg:text-5xl">{workout.name}</h1>

          {workout.description ? <p className="mt-4 max-w-2xl text-sm leading-7 whitespace-pre-line text-zinc-400 sm:text-base">{workout.description}</p> : <p className="mt-4 text-sm text-zinc-500">Inga detaljer har lagts till för det här träningspasset ännu.</p>}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
              ⚡ {totalExercises} {totalExercises === 1 ? 'övning' : 'övningar'}
            </span>

            <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300">↻ {totalSets} set totalt</span>
          </div>
        </div>
      </header>

      {/* Statistics */}

      <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        <div className="col-span-1">
          <DashboardStatCard icon={<FaDumbbell />} title="Övningar" value={totalExercises} subtitle="Övningar i träningspasset" />
        </div>

        <div className="col-span-1">
          <DashboardStatCard icon={<BsClock />} title="Planerade set" value={totalSets} subtitle="Totalt antal set" />
        </div>

        <div className="col-span-2 xl:col-span-1">
          <DashboardStatCard icon={<FaFire />} title="Träningstid" value={totalSeconds > 0 ? formatDuration(totalSeconds) : '—'} subtitle="Beräknad tid för tidsövningar" />
        </div>
      </div>

      {/* Exercises */}
      <div className="w-full min-w-0">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold tracking-[0.18em] text-blue-400 uppercase">Ditt upplägg</p>

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
          <div className={`grid w-full min-w-0 items-stretch gap-5 ${exerciseGridClass}`}>
            {exercises.map((exercise, index) => {
              const sessionExercise = sessionExercises.find((item) => item.exerciseId === exercise.exerciseId);

              const exerciseSets = sessionExercise?.sets ?? [];

              const exerciseCompletedSets = exerciseSets.filter((set) => set.completed);

              const exerciseActualReps = exerciseCompletedSets.reduce((total, set) => total + (set.actualReps ?? 0), 0);

              const exerciseActualSeconds = exerciseCompletedSets.reduce((total, set) => total + (set.actualSeconds ?? 0), 0);

              const previousSessionWithExercise = previousSessions.find((previousSession) => previousSession.exercises.some((item) => item.exerciseId === exercise.exerciseId && item.sets.some((set) => set.completed)));

              const previousSessionExercise = previousSessionWithExercise?.exercises.find((item) => item.exerciseId === exercise.exerciseId && item.sets.some((set) => set.completed));

              const currentAverageWeight = getAverageWeight(sessionExercise);
              const previousAverageWeight = getAverageWeight(previousSessionExercise);

              const previousReps = previousSessionExercise ? getCompletedReps(previousSessionExercise) : null;

              const previousSeconds = previousSessionExercise ? getCompletedSeconds(previousSessionExercise) : null;

              const currentReps = getCompletedReps(sessionExercise);
              const currentSeconds = getCompletedSeconds(sessionExercise);

              const repsStatus = getProgressStatus(currentReps, previousReps);

              const weightStatus = getProgressStatus(currentAverageWeight, previousAverageWeight);

              const secondsStatus = getProgressStatus(currentSeconds, previousSeconds);

              const statuses = [repsStatus, weightStatus, secondsStatus];

              const comparableCount = statuses.filter((status) => status !== 'missing').length;

              const improvedCount = statuses.filter((status) => status === 'improved').length;

              const lowerCount = statuses.filter((status) => status === 'lower').length;

              const unchangedCount = statuses.filter((status) => status === 'unchanged').length;

              const summary = comparableCount === 0 ? 'Ingen jämförbar data' : `${improvedCount} av ${comparableCount} mätvärden förbättrade`;

              return (
                <article key={`${exercise.exerciseId}-${exercise.order}`} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 transition duration-200 hover:border-blue-400/30 hover:bg-zinc-900">
                  {/* Exercise header */}
                  <div className="flex items-start gap-4 border-b border-white/[0.06] p-5 sm:p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-sm font-extrabold text-blue-300 sm:h-14 sm:w-14">{String(index + 1).padStart(2, '0')}</div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-lg font-bold break-words text-white">{exercise.name}</h3>

                        <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-400">{exercise.sets} set planerade</span>
                      </div>

                      <p className="mt-1 text-xs text-zinc-500">
                        Övning {index + 1} av {totalExercises}
                      </p>

                      {session && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                              comparableCount === 0 ? 'border-white/10 bg-white/5 text-zinc-400' : lowerCount > 0 ? 'border-amber-400/20 bg-amber-400/10 text-amber-300' : improvedCount > 0 ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300' : 'border-white/10 bg-white/5 text-zinc-300'
                            }`}
                          >
                            {comparableCount === 0 ? '—' : lowerCount > 0 ? '↓' : improvedCount > 0 ? '↑' : '—'} {summary}
                          </span>

                          {unchangedCount > 0 && comparableCount > 0 && <span className="text-xs text-zinc-500">{unchangedCount} oförändrade</span>}

                          {lowerCount > 0 && <span className="text-xs text-amber-300">{lowerCount} lägre</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Exercise content */}
                  <div className="flex flex-1 flex-col gap-6 p-5 sm:p-6">
                    {/* Planned values */}
                    <section className="min-w-0">
                      <SectionHeading>Planerade värden</SectionHeading>

                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {exercise.reps != null && <MetricPill label="Reps" value={String(exercise.reps)} />}

                        {exercise.weight != null ? <MetricPill label="Planerad vikt" value={`${exercise.weight} kg`} /> : <MetricPill label="Belastning" value="Kroppsvikt" />}

                        {exercise.seconds != null && <MetricPill label="Tid" value={formatDuration(exercise.seconds)} />}

                        <MetricPill label="Set" value={String(exercise.sets)} />
                      </div>
                    </section>

                    {/* Latest results */}
                    {session && sessionExercise && (
                      <section className="min-w-0 rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.05] p-4 sm:p-5">
                        <SectionHeading color="emerald">Resultat från senaste passet</SectionHeading>

                        <p className="mt-2 text-sm text-zinc-500">Dina faktiskt registrerade träningsresultat</p>

                        <div className={`mt-4 grid gap-3 ${detailsGridClass}`}>
                          <ValueCard title="Utförda repetitioner" value={`${exerciseActualReps} reps`} actual />

                          <ValueCard title="Vikt per set" value={exerciseCompletedSets.length > 0 ? exerciseCompletedSets.map((set) => (set.actualWeight !== null ? `${set.actualWeight} kg` : 'Ej angiven')).join(' · ') : 'Inga slutförda set'} actual />

                          <ValueCard title="Total arbetstid" value={exerciseActualSeconds > 0 ? formatDuration(exerciseActualSeconds) : 'Ingen tid registrerad'} actual />
                        </div>
                      </section>
                    )}

                    {/* Progression */}
                    {session && (
                      <section className="min-w-0 rounded-2xl border border-blue-400/15 bg-blue-500/[0.05] p-4 sm:p-5">
                        <SectionHeading color="blue">Progression</SectionHeading>

                        <p className="mt-2 text-sm text-zinc-500">{previousSessionWithExercise ? `Senast utförd: ${formatDate(previousSessionWithExercise.finishedAt)}` : 'Ingen tidigare registrering av övningen'}</p>

                        {!previousSessionExercise ? (
                          <p className="mt-4 rounded-xl bg-black/20 p-4 text-sm text-zinc-400">Ingen tidigare registrering av övningen.</p>
                        ) : (
                          <div className={`mt-4 grid gap-3 ${detailsGridClass}`}>
                            <ProgressCard title="Repetitioner" current={currentReps} previous={previousReps} unit="reps" />

                            <ProgressCard title="Genomsnittlig vikt" current={currentAverageWeight} previous={previousAverageWeight} unit="kg" />

                            <ProgressCard title="Arbetstid" current={currentSeconds} previous={previousSeconds} unit="sek" />
                          </div>
                        )}
                      </section>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.06] px-5 py-4 sm:px-6">
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

function SectionHeading({ children, color = 'default' }: { children: React.ReactNode; color?: 'default' | 'emerald' | 'blue' }) {
  const colorClass = color === 'emerald' ? 'text-emerald-400' : color === 'blue' ? 'text-blue-400' : 'text-zinc-300';

  return <h4 className={`text-sm font-bold tracking-wider uppercase ${colorClass}`}>{children}</h4>;
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-3 sm:px-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold break-words text-white">{value}</p>
    </div>
  );
}

function ValueCard({ title, value, actual = false }: { title: string; value: string; actual?: boolean }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.06] bg-black/20 p-4">
      <p className={`text-xs font-bold tracking-wider uppercase ${actual ? 'text-emerald-400/80' : 'text-zinc-500'}`}>{title}</p>

      <p className="mt-3 text-sm leading-relaxed font-semibold break-words text-zinc-200">{value}</p>
    </div>
  );
}

function ProgressCard({ title, current, previous, unit, higherIsBetter = true }: { title: string; current: number | null; previous: number | null; unit: string; higherIsBetter?: boolean }) {
  const formatValue = (value: number) => (Number.isInteger(value) ? String(value) : value.toLocaleString('sv-SE'));

  if (current === null || previous === null) {
    return (
      <div className="min-w-0 rounded-xl border border-white/[0.06] bg-black/20 p-4">
        <p className="text-xs font-bold tracking-wider text-zinc-500 uppercase">{title}</p>

        <p className="mt-3 text-sm text-zinc-400">Otillräckliga data</p>
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
    <div className="min-w-0 rounded-xl border border-white/[0.06] bg-black/20 p-4">
      <p className="text-xs font-bold tracking-wider text-zinc-500 uppercase">{title}</p>

      <p className={`mt-3 text-sm font-bold ${status.color}`}>
        {status.icon} {status.label}
      </p>

      <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
        <p className="text-sm text-zinc-400">
          Skillnad:{' '}
          <span className="font-semibold text-zinc-200">
            {unchanged ? '0' : `${difference > 0 ? '+' : '−'}${formatValue(Math.abs(difference))}`} {unit}
          </span>
        </p>

        <p className="text-sm text-zinc-500">
          Nu: {formatValue(current)} {unit}
        </p>

        <p className="text-sm text-zinc-500">
          Föregående: {formatValue(previous)} {unit}
        </p>
      </div>
    </div>
  );
}
