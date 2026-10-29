'use client';

import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Dumbbell, Repeat2, TrendingUp, Weight, Trophy } from 'lucide-react';

import type { ExerciseProgress as ExerciseProgressType } from '@/types/progress-type';
import ExerciseChart from './progress-exercise-chart';

type ChartMetric = 'weight' | 'reps' | 'seconds';

type Props = {
  exerciseProgress: ExerciseProgressType[];
  metric: ChartMetric;
};

export default function ExerciseProgress({ exerciseProgress, metric }: Props) {
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(exerciseProgress[0]?.exerciseId ?? null);

  const [chartMetric, setChartMetric] = useState<ChartMetric>(metric);

  const selectedExercise = exerciseProgress.find((exercise) => exercise.exerciseId === selectedExerciseId);

  const isPlank = /plank/i.test(selectedExercise?.exerciseName ?? '');

  const activeChartMetric: ChartMetric = isPlank ? 'seconds' : chartMetric;

  const history = useMemo(
    () => [...(selectedExercise?.history ?? [])].sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime()),
    [selectedExercise],
  );

  const first = history[0];
  const current = history.at(-1);

  const weightChange = first && current ? current.weight - first.weight : null;

  const weightChangePercent = first && current && first.weight > 0 && weightChange !== null ? (weightChange / first.weight) * 100 : null;

  const bestWeight = history.reduce((best, entry) => (entry.weight > 0 ? Math.max(best, entry.weight) : best), 0);

  const bestReps = history.reduce((best, entry) => (entry.reps > 0 ? Math.max(best, entry.reps) : best), 0);

  const bestSeconds = history.reduce((best, entry) => ((entry.seconds ?? 0) > 0 ? Math.max(best, entry.seconds ?? 0) : best), 0);

  const trainingDays = new Set(history.map((entry) => new Date(entry.loggedAt).toLocaleDateString('sv-SE'))).size;

  const bestWeightEntry = history.find((entry) => entry.weight > 0 && entry.weight === bestWeight);

  const bestRepsEntry = history.find((entry) => entry.reps > 0 && entry.reps === bestReps);

  const bestSecondsEntry = history.find((entry) => (entry.seconds ?? 0) > 0 && entry.seconds === bestSeconds);

  // Mark records only when they exceed a previous valid result.
  const { newWeightRecords, newRepsRecords, newSecondsRecords } = history.reduce(
    (records, entry) => {
      const seconds = entry.seconds ?? 0;

      if (entry.weight > 0 && records.highestWeight !== null && entry.weight > records.highestWeight) {
        records.newWeightRecords.add(entry);
      }

      if (entry.reps > 0 && records.highestReps !== null && entry.reps > records.highestReps) {
        records.newRepsRecords.add(entry);
      }

      if (seconds > 0 && records.highestSeconds !== null && seconds > records.highestSeconds) {
        records.newSecondsRecords.add(entry);
      }

      if (entry.weight > 0) {
        records.highestWeight = records.highestWeight === null ? entry.weight : Math.max(records.highestWeight, entry.weight);
      }

      if (entry.reps > 0) {
        records.highestReps = records.highestReps === null ? entry.reps : Math.max(records.highestReps, entry.reps);
      }

      if (seconds > 0) {
        records.highestSeconds = records.highestSeconds === null ? seconds : Math.max(records.highestSeconds, seconds);
      }

      return records;
    },
    {
      highestWeight: null as number | null,
      highestReps: null as number | null,
      highestSeconds: null as number | null,
      newWeightRecords: new Set<(typeof history)[number]>(),
      newRepsRecords: new Set<(typeof history)[number]>(),
      newSecondsRecords: new Set<(typeof history)[number]>(),
    },
  );

  return (
    <section className="mb-10 rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-950 p-6">
      <header className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
          <Dumbbell className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-semibold text-white">Träningsprogression</h2>
          <p className="text-sm text-zinc-500">Följ dina resultat och se hur de utvecklas över tid.</p>
        </div>
      </header>

      {exerciseProgress.length > 0 ? (
        <>
          <div className="mt-6">
            <label htmlFor="progress-exercise" className="mb-2 block text-sm font-medium text-zinc-400">
              Välj övning
            </label>

            <select
              id="progress-exercise"
              value={selectedExerciseId ?? ''}
              onChange={(event) => {
                setSelectedExerciseId(Number(event.target.value));
                setChartMetric(metric === 'seconds' ? 'seconds' : 'weight');
              }}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500 sm:max-w-md"
            >
              {exerciseProgress.map((exercise) => (
                <option key={exercise.exerciseId} value={exercise.exerciseId}>
                  {exercise.exerciseName}
                </option>
              ))}
            </select>
          </div>

          {selectedExercise && (
            <>
              {history.length > 0 ? (
                <>
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                      label={isPlank ? 'Senaste tid' : 'Senaste resultat'}
                      value={isPlank ? `${current?.seconds ?? 0} sek` : `${current?.weight ?? 0} kg`}
                      detail={isPlank ? 'Senast registrerade planktiden' : current ? `${current.reps} repetitioner` : 'Inga resultat'}
                      icon={<Weight className="h-4 w-4" />}
                    />

                    <StatCard
                      label={isPlank ? 'Personligt tidsrekord' : 'Bästa vikt'}
                      value={isPlank ? `${bestSeconds} sek` : `${bestWeight} kg`}
                      detail={
                        isPlank
                          ? bestSecondsEntry
                            ? `Uppnått ${new Date(bestSecondsEntry.loggedAt).toLocaleDateString('sv-SE')}`
                            : 'Inget rekord ännu'
                          : bestWeightEntry
                            ? `Uppnått ${new Date(bestWeightEntry.loggedAt).toLocaleDateString('sv-SE')}`
                            : 'Ingen giltig vikt registrerad'
                      }
                      icon={<Trophy className="h-4 w-4" />}
                    />

                    <StatCard
                      label={isPlank ? 'Träningsdagar' : 'Flest repetitioner'}
                      value={isPlank ? String(trainingDays) : String(bestReps)}
                      detail={
                        isPlank
                          ? 'Dagar med registrerad träning'
                          : bestRepsEntry
                            ? `Uppnått ${new Date(bestRepsEntry.loggedAt).toLocaleDateString('sv-SE')}`
                            : 'Inga giltiga repetitioner registrerade'
                      }
                      icon={<Repeat2 className="h-4 w-4" />}
                    />
                  </div>

                  {!isPlank && first && current && (
                    <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                      <div className="flex items-center gap-2 text-zinc-400">
                        {weightChange !== null && weightChange > 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                        ) : weightChange !== null && weightChange < 0 ? (
                          <ArrowDownRight className="h-4 w-4 text-rose-400" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-zinc-400" />
                        )}

                        <h3 className="text-sm font-medium">Viktutveckling sedan första registreringen</h3>
                      </div>

                      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <p
                          className={`text-2xl font-bold ${
                            weightChange !== null && weightChange > 0 ? 'text-emerald-400' : weightChange !== null && weightChange < 0 ? 'text-rose-400' : 'text-white'
                          }`}
                        >
                          {weightChange !== null && weightChange > 0 ? '+' : ''}
                          {weightChange !== null ? weightChange.toLocaleString('sv-SE') : '—'} kg
                        </p>

                        <p className="text-sm text-zinc-400">
                          {weightChangePercent !== null
                            ? `(${weightChangePercent > 0 ? '+' : ''}${weightChangePercent.toLocaleString('sv-SE', { maximumFractionDigits: 1 })} %)`
                            : '(Procent kan inte beräknas från 0 kg)'}
                        </p>
                      </div>

                      <p className="mt-2 text-xs text-zinc-500">
                        Första: {first.weight} kg · Senaste: {current.weight} kg
                      </p>
                    </div>
                  )}

                  {isPlank && first && current && (
                    <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                      <h3 className="text-sm font-medium text-zinc-400">Tidsutveckling sedan första registreringen</h3>

                      <p className="mt-2 text-sm text-zinc-300">
                        Första: {first.seconds ?? 0} sekunder
                        {' · '}
                        Senaste: {current.seconds ?? 0} sekunder
                      </p>
                    </div>
                  )}

                  <div className="mt-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Utveckling över tid</h3>
                        <p className="mt-1 text-sm text-zinc-500">{isPlank ? 'Följ hur länge du kan hålla plankan.' : 'Välj vilket resultat du vill följa i grafen.'}</p>
                      </div>

                      <div className="inline-flex w-fit rounded-xl border border-zinc-800 bg-zinc-950 p-1" role="group" aria-label="Välj mätvärde för grafen">
                        {isPlank ? (
                          <span className="rounded-lg bg-purple-500/15 px-4 py-2 text-sm text-purple-300">Tid (sekunder)</span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => setChartMetric('weight')}
                              aria-pressed={activeChartMetric === 'weight'}
                              className={`rounded-lg px-4 py-2 text-sm transition ${
                                activeChartMetric === 'weight' ? 'bg-purple-500/15 text-purple-300' : 'text-zinc-400 hover:text-white'
                              }`}
                            >
                              Vikt (kg)
                            </button>

                            <button
                              type="button"
                              onClick={() => setChartMetric('reps')}
                              aria-pressed={activeChartMetric === 'reps'}
                              className={`rounded-lg px-4 py-2 text-sm transition ${
                                activeChartMetric === 'reps' ? 'bg-purple-500/15 text-purple-300' : 'text-zinc-400 hover:text-white'
                              }`}
                            >
                              Repetitioner
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <ExerciseChart history={history} metric={activeChartMetric} />
                  </div>

                  <div className="mt-8">
                    <div className="mb-5">
                      <h3 className="text-lg font-semibold text-white">Träningshistorik</h3>
                      <p className="mt-1 text-sm text-zinc-500">Dina resultat och set för varje träningsdag.</p>
                    </div>

                    <div className="mb-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                        <p className="text-sm text-zinc-400">Träningsdagar</p>
                        <p className="mt-2 text-2xl font-bold text-white">{trainingDays}</p>
                      </div>

                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                        <p className="text-sm text-zinc-400">Totalt antal set</p>
                        <p className="mt-2 text-2xl font-bold text-orange-400">{history.length}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {Array.from(
                        history.reduce((groups, entry) => {
                          const dateKey = new Date(entry.loggedAt).toLocaleDateString('sv-SE');

                          const existing = groups.get(dateKey) ?? [];
                          existing.push(entry);
                          groups.set(dateKey, existing);

                          return groups;
                        }, new Map<string, typeof history>()),
                      )
                        .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                        .map(([dateKey, entries]) => (
                          <div key={dateKey} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 transition-colors hover:border-zinc-700">
                            <div className="flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/70 px-4 py-4 sm:px-5">
                              <div>
                                <h4 className="font-semibold text-white">
                                  {new Date(`${dateKey}T12:00:00`).toLocaleDateString('sv-SE', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </h4>
                                <p className="mt-1 text-xs text-zinc-500">
                                  {entries.length} {entries.length === 1 ? 'set registrerat' : 'set registrerade'}
                                </p>
                              </div>

                              <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-sm font-semibold text-orange-300">
                                <Repeat2 className="h-4 w-4" />
                                {entries.length} set
                              </span>
                            </div>

                            <div className="divide-y divide-zinc-800/70">
                              {entries.map((entry, index) => {
                                const isWeightRecord = newWeightRecords.has(entry);
                                const isRepsRecord = newRepsRecords.has(entry);
                                const isSecondsRecord = newSecondsRecords.has(entry);

                                return (
                                  <div
                                    key={`${entry.loggedAt}-${index}`}
                                    className="flex items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-zinc-800/20 sm:px-5"
                                  >
                                    <div className="flex min-w-0 items-center gap-3">
                                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/80 text-sm font-semibold text-zinc-300">
                                        {index + 1}
                                      </div>

                                      <div className="min-w-0">
                                        <p className="font-semibold text-white">
                                          {isPlank ? `${entry.seconds ?? 0} sekunder` : `${entry.weight ?? 0} kg × ${entry.reps} reps`}
                                        </p>
                                        <p className="mt-1 text-xs text-zinc-500">Set {index + 1}</p>
                                      </div>
                                    </div>

                                    <div className="flex shrink-0 flex-col items-end gap-2">
                                      {isPlank && isSecondsRecord && <RecordBadge label="Tidsrekord" />}

                                      {!isPlank && isWeightRecord && <RecordBadge label="Viktrekord" />}

                                      {!isPlank && isRepsRecord && <RecordBadge label="Repsrekord" variant="green" />}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-400">
                  Det finns inga registrerade resultat för den här övningen ännu.
                </p>
              )}
            </>
          )}
        </>
      ) : (
        <p className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-400">
          Ingen träningshistorik finns ännu. Slutför ett träningspass och registrera dina resultat för att börja följa utvecklingen.
        </p>
      )}
    </section>
  );
}

function RecordBadge({ label, variant = 'purple' }: { label: string; variant?: 'purple' | 'green' }) {
  const colors = variant === 'green' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-purple-500/10 text-purple-300';

  return (
    <span className={`rounded-md px-2 py-1 text-xs font-medium ${colors}`}>
      <Trophy className="mr-1 inline h-3 w-3" />
      {label}
    </span>
  );
}

function StatCard({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center gap-2 text-zinc-500">
        {icon}
        <p className="text-xs font-medium uppercase tracking-wider">{label}</p>
      </div>

      <p className="mt-3 text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{detail}</p>
    </div>
  );
}
