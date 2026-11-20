import type { WorkoutViewModel, WorkoutSessionViewModel } from '@/types/workout-types';

import { FaDumbbell, FaFire } from 'react-icons/fa';
import { BsClock } from 'react-icons/bs';

import StatsCard from '@/components/ui/stats-card';

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
    <section className="mx-auto w-full min-w-0 space-y-6 pb-8 sm:space-y-8 sm:pb-10">
      {/* Statistics */}
      <div className="grid min-w-0 grid-cols-1 gap-3 min-[520px]:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        <div className="col-span-1">
          <StatsCard icon={<FaDumbbell />} title="Övningar" value={totalExercises} subtitle="Övningar i träningspasset" />
        </div>

        <div className="col-span-1">
          <StatsCard icon={<BsClock />} title="Planerade set" value={totalSets} subtitle="Totalt antal set" />
        </div>

        <div className="col-span-1 min-[520px]:col-span-2 xl:col-span-1">
          <StatsCard icon={<FaFire />} title="Träningstid" value={totalSeconds > 0 ? formatDuration(totalSeconds) : '—'} subtitle="Beräknad tid för tidsövningar" />
        </div>
      </div>

      {/* Exercises */}
      <div className="w-full min-w-0">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-5 sm:gap-4">
          <div>
            <p className="text-primary mb-1 text-xs font-bold tracking-[0.18em] uppercase">Ditt upplägg</p>
            <h2 className="text-text text-xl font-bold sm:text-3xl">Övningar</h2>
          </div>

          <span className="border-border bg-surface-secondary text-text-secondary shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium">{totalExercises} totalt</span>
        </div>

        {exercises.length === 0 ? (
          <div className="border-border bg-surface/50 rounded-2xl border border-dashed px-6 py-12 text-center">
            <p className="text-text-secondary text-base font-semibold">Inga övningar ännu</p>
            <p className="text-text-muted mt-2 text-sm">Lägg till övningar för att bygga ditt träningspass.</p>
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
                <article key={`${exercise.exerciseId}-${exercise.order}`} className="border-border bg-surface/60 hover:border-primary/30 hover:bg-surface flex min-w-0 flex-col overflow-hidden rounded-2xl border transition duration-200">
                  {/* Exercise header */}
                  <div className="border-border flex items-start gap-3 border-b p-4 sm:gap-4 sm:p-6">
                    <div className="border-primary/15 bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-extrabold sm:h-14 sm:w-14">{String(index + 1).padStart(2, '0')}</div>

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 sm:gap-3">
                        <h3 className="text-text text-lg font-bold break-words">{exercise.name}</h3>

                        <span className="border-border bg-surface-secondary text-text-secondary shrink-0 rounded-lg border px-2.5 py-1.5 text-xs font-medium sm:px-3">{exercise.sets} set planerade</span>
                      </div>

                      <p className="text-text-muted mt-1 text-xs">
                        Övning {index + 1} av {totalExercises}
                      </p>

                      {session && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                              comparableCount === 0
                                ? 'border-border bg-surface-secondary text-text-secondary'
                                : lowerCount > 0
                                  ? 'border-warning/20 bg-warning/10 text-warning'
                                  : improvedCount > 0
                                    ? 'border-primary/20 bg-primary/10 text-primary'
                                    : 'border-border bg-surface-secondary text-text-secondary'
                            }`}
                          >
                            {comparableCount === 0 ? '—' : lowerCount > 0 ? '↓' : improvedCount > 0 ? '↑' : '—'} {summary}
                          </span>

                          {unchangedCount > 0 && comparableCount > 0 && <span className="text-text-muted text-xs">{unchangedCount} oförändrade</span>}

                          {lowerCount > 0 && <span className="text-warning text-xs">{lowerCount} lägre</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Exercise content */}
                  <div className="flex flex-1 flex-col gap-5 p-4 sm:gap-6 sm:p-6">
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
                      <section className="border-primary/20 bg-primary/[0.04] min-w-0 rounded-2xl border p-3 sm:p-5">
                        <SectionHeading color="primary">Resultat från senaste passet</SectionHeading>

                        <p className="text-text-muted mt-2 text-sm">Dina faktiskt registrerade träningsresultat</p>

                        <div className={`mt-4 grid gap-3 ${detailsGridClass}`}>
                          <ValueCard title="Utförda repetitioner" value={`${exerciseActualReps} reps`} actual />

                          <ValueCard title="Vikt per set" value={exerciseCompletedSets.length > 0 ? exerciseCompletedSets.map((set) => (set.actualWeight !== null ? `${set.actualWeight} kg` : 'Ej angiven')).join(' · ') : 'Inga slutförda set'} actual />

                          <ValueCard title="Total arbetstid" value={exerciseActualSeconds > 0 ? formatDuration(exerciseActualSeconds) : 'Ingen tid registrerad'} actual />
                        </div>
                      </section>
                    )}

                    {/* Progression */}
                    {session && (
                      <section className="border-primary/20 bg-primary/[0.03] min-w-0 rounded-2xl border p-3 sm:p-5">
                        <SectionHeading color="primary">Progression</SectionHeading>

                        <p className="text-text-muted mt-2 text-sm">{previousSessionWithExercise ? `Senast utförd: ${formatDate(previousSessionWithExercise.finishedAt)}` : 'Ingen tidigare registrering av övningen'}</p>

                        {!previousSessionExercise ? (
                          <p className="bg-surface-secondary text-text-secondary mt-4 rounded-xl p-4 text-sm">Ingen tidigare registrering av övningen.</p>
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
                  <div className="border-border mt-auto flex items-center justify-between gap-3 border-t px-4 py-3 sm:px-6 sm:py-4">
                    <span className="text-text-muted text-xs">
                      Övning {index + 1} av {totalExercises}
                    </span>

                    {exercise.seconds != null && (
                      <span className="text-primary inline-flex items-center gap-1.5 text-xs font-medium">
                        <span className="bg-primary h-1.5 w-1.5 rounded-full" />
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

function SectionHeading({ children, color = 'default' }: { children: React.ReactNode; color?: 'default' | 'primary' }) {
  const colorClass = color === 'primary' ? 'text-primary' : 'text-text-secondary';

  return <h4 className={`text-sm font-bold tracking-wider uppercase ${colorClass}`}>{children}</h4>;
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border bg-surface-secondary/50 min-w-0 rounded-xl border px-3 py-3 sm:px-4">
      <p className="text-text-muted text-xs">{label}</p>

      <p className="text-text mt-1 text-sm font-semibold break-words">{value}</p>
    </div>
  );
}

function ValueCard({ title, value, actual = false }: { title: string; value: string; actual?: boolean }) {
  return (
    <div className="border-border bg-surface-secondary/50 min-w-0 rounded-xl border p-3 sm:p-4">
      <p className={`text-xs font-bold tracking-wider uppercase ${actual ? 'text-primary/80' : 'text-text-muted'}`}>{title}</p>

      <p className="text-text-secondary mt-3 text-sm leading-relaxed font-semibold break-words">{value}</p>
    </div>
  );
}

function ProgressCard({ title, current, previous, unit, higherIsBetter = true }: { title: string; current: number | null; previous: number | null; unit: string; higherIsBetter?: boolean }) {
  const formatValue = (value: number) => (Number.isInteger(value) ? String(value) : value.toLocaleString('sv-SE'));

  if (current === null || previous === null) {
    return (
      <div className="border-border bg-surface-secondary/50 min-w-0 rounded-xl border p-3 sm:p-4">
        <p className="text-text-muted text-xs font-bold tracking-wider uppercase">{title}</p>

        <p className="text-text-secondary mt-3 text-sm">Otillräckliga data</p>
      </div>
    );
  }

  const difference = Number((current - previous).toFixed(2));
  const unchanged = difference === 0;

  const improved = higherIsBetter ? difference > 0 : difference < 0;

  const status = unchanged
    ? {
        label: 'Oförändrat',
        color: 'text-text-secondary',
        icon: '—',
      }
    : {
        label: improved ? 'Förbättring' : 'Lägre resultat',
        color: improved ? 'text-primary' : 'text-danger',
        icon: improved ? '↑' : '↓',
      };

  return (
    <div className="border-border bg-surface-secondary/50 min-w-0 rounded-xl border p-4">
      <p className="text-text-muted text-xs font-bold tracking-wider uppercase">{title}</p>

      <p className={`mt-3 text-sm font-bold ${status.color}`}>
        {status.icon} {status.label}
      </p>

      <div className="border-border mt-4 space-y-2 border-t pt-4">
        <p className="text-text-secondary text-sm">
          Skillnad:{' '}
          <span className="text-text font-semibold">
            {unchanged ? '0' : `${difference > 0 ? '+' : '−'}${formatValue(Math.abs(difference))}`} {unit}
          </span>
        </p>

        <p className="text-text-muted text-sm">
          Nu: {formatValue(current)} {unit}
        </p>

        <p className="text-text-muted text-sm">
          Föregående: {formatValue(previous)} {unit}
        </p>
      </div>
    </div>
  );
}
