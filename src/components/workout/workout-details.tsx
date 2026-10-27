import type { WorkoutViewModel, WorkoutSessionViewModel } from '@/types/workout-types';

interface Props {
  workout: WorkoutViewModel;
  session: WorkoutSessionViewModel | null;
}

export default function WorkoutDetails({ workout, session }: Props) {
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

  const sessionExercises = session?.exercises ?? [];

  const completedSets = sessionExercises.reduce((total, exercise) => total + exercise.sets.filter((set) => set.completed).length, 0);

  const actualReps = sessionExercises.reduce(
    (total, exercise) => total + exercise.sets.reduce((setTotal, set) => setTotal + (set.completed ? (set.actualReps ?? 0) : 0), 0),
    0,
  );

  const actualSeconds = sessionExercises.reduce(
    (total, exercise) => total + exercise.sets.reduce((setTotal, set) => setTotal + (set.completed ? (set.actualSeconds ?? 0) : 0), 0),
    0,
  );

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
        <StatCard title="Planerad arbetstid" value={totalSeconds > 0 ? formatDuration(totalSeconds) : '—'} />
      </div>

      {session && (
        <div>
          <div className="mb-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">Senaste avslutade pass</p>
            <h2 className="text-2xl font-bold text-white">Dina faktiska resultat</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard title="Utförda reps" value={String(actualReps)} />
            <StatCard title="  set" value={`${completedSets}`} />
            <StatCard title="Faktisk arbetstid" value={actualSeconds > 0 ? formatDuration(actualSeconds) : '—'} />
          </div>
        </div>
      )}

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
              const sessionExercise = sessionExercises.find((item) => item.name === exercise.name);

              const exerciseSets = sessionExercise?.sets ?? [];
              const exerciseCompletedSets = exerciseSets.filter((set) => set.completed);

              const exerciseActualReps = exerciseCompletedSets.reduce((total, set) => total + (set.actualReps ?? 0), 0);

              const exerciseActualSeconds = exerciseCompletedSets.reduce((total, set) => total + (set.actualSeconds ?? 0), 0);

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
                          <p className="mt-1 text-xs text-zinc-500">
                            Övning {index + 1} av {totalExercises}
                          </p>
                        </div>

                        <span className="w-fit shrink-0 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-zinc-400">
                          {exercise.sets} set planerade
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        <ValueCard title="Planned reps" value={exercise.reps != null ? `${exercise.reps} reps` : 'Ej angivet'} />
                        <ValueCard title="Planned weight" value={exercise.weight != null ? `${exercise.weight} kg` : 'Kroppsvikt / ej angivet'} />
                        <ValueCard title="Planned time" value={exercise.seconds != null ? formatDuration(exercise.seconds) : 'Ej tidsbestämd'} />
                      </div>

                      {session && sessionExercise && (
                        <div className="mt-3 rounded-xl border border-emerald-400/15 bg-emerald-500/[0.05] p-3 sm:p-4">
                          <div className="mb-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Resultat från senaste passet</p>
                            <p className="mt-1 text-xs text-zinc-500">Dina faktiskt registrerade träningsresultat</p>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

                  <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                    <p className="text-xs text-zinc-500">
                      {exercise.sets} ×{' '}
                      {exercise.seconds != null ? formatDuration(exercise.seconds) : exercise.reps != null ? `${exercise.reps} reps` : 'Ej specificerat'}
                    </p>

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
    <div className="rounded-xl border border-white/5 bg-black/20 p-3">
      <p className={`text-[10px] font-bold uppercase tracking-wider ${actual ? 'text-emerald-400/80' : 'text-zinc-500'}`}>{title}</p>
      <p className="mt-1.5 text-sm font-semibold text-zinc-200">{value}</p>
    </div>
  );
}
