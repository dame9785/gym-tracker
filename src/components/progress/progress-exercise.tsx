'use client';

import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Dumbbell, Repeat2, TrendingUp, Weight, Trophy } from 'lucide-react';

import Button from '@/components/button/button';
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

  const history = useMemo(() => [...(selectedExercise?.history ?? [])].sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime()), [selectedExercise]);

  const first = history[0];
  const current = history.at(-1);

  const weightChange = first && current ? current.weight - first.weight : null;

  const weightChangePercent = first && current && first.weight > 0 && weightChange !== null ? (weightChange / first.weight) * 100 : null;

  const bestWeight = history.reduce((best, entry) => (entry.weight > 0 ? Math.max(best, entry.weight) : best), 0);

  const bestReps = history.reduce((best, entry) => (entry.reps > 0 ? Math.max(best, entry.reps) : best), 0);

  const bestSeconds = history.reduce((best, entry) => ((entry.seconds ?? 0) > 0 ? Math.max(best, entry.seconds ?? 0) : best), 0);

  const trainingDays = new Set(history.map((entry) => new Date(entry.loggedAt).toLocaleDateString('en-US'))).size;

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
    <section className="border-border from-surface to-background mb-10 rounded-2xl border bg-linear-to-br p-6">
      <header className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
          <Dumbbell className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-text font-semibold">Training Progress</h2>
          <p className="text-text-muted text-sm">Track your performance and see how it improves over time.</p>
        </div>
      </header>

      {exerciseProgress.length > 0 ? (
        <>
          <div className="mt-6">
            <label htmlFor="progress-exercise" className="text-text-secondary mb-2 block text-sm font-medium">
              Select Exercise
            </label>

            <select
              id="progress-exercise"
              value={selectedExerciseId ?? ''}
              onChange={(event) => {
                setSelectedExerciseId(Number(event.target.value));
                setChartMetric(metric === 'seconds' ? 'seconds' : 'weight');
              }}
              className="border-border bg-surface text-text focus:border-primary w-full rounded-xl border px-4 py-3 text-sm transition outline-none sm:max-w-md"
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
                  <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <StatCard
                      label={isPlank ? 'Latest Time' : 'Latest Result'}
                      value={isPlank ? `${current?.seconds ?? 0} sec` : `${current?.weight ?? 0} kg`}
                      detail={isPlank ? 'Most recently recorded plank time' : current ? `${current.reps} reps` : 'No results'}
                      icon={<Weight className="h-4 w-4" />}
                    />

                    <StatCard
                      label={isPlank ? 'Personal Time Record' : 'Best Weight'}
                      value={isPlank ? `${bestSeconds} sec` : `${bestWeight} kg`}
                      detail={isPlank ? (bestSecondsEntry ? `Achieved ${new Date(bestSecondsEntry.loggedAt).toLocaleDateString('en-US')}` : 'No record yet') : bestWeightEntry ? `Achieved ${new Date(bestWeightEntry.loggedAt).toLocaleDateString('en-US')}` : 'No valid weight recorded'}
                      icon={<Trophy className="h-4 w-4" />}
                    />

                    <StatCard
                      label={isPlank ? 'Training Days' : 'Most Reps'}
                      value={isPlank ? String(trainingDays) : String(bestReps)}
                      detail={isPlank ? 'Days with recorded training' : bestRepsEntry ? `Achieved ${new Date(bestRepsEntry.loggedAt).toLocaleDateString('en-US')}` : 'No valid reps recorded'}
                      icon={<Repeat2 className="h-4 w-4" />}
                    />
                  </div>

                  {!isPlank && first && current && (
                    <div className="border-border bg-surface/50 mt-4 rounded-xl border p-4">
                      <div className="text-text-secondary flex items-center gap-2">
                        {weightChange !== null && weightChange > 0 ? <ArrowUpRight className="text-success h-4 w-4" /> : weightChange !== null && weightChange < 0 ? <ArrowDownRight className="text-danger h-4 w-4" /> : <TrendingUp className="text-text-muted h-4 w-4" />}

                        <h3 className="text-sm font-medium">Weight Progress Since First Entry</h3>
                      </div>

                      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <p className={`text-2xl font-bold ${weightChange !== null && weightChange > 0 ? 'text-success' : weightChange !== null && weightChange < 0 ? 'text-danger' : 'text-text'}`}>
                          {weightChange !== null && weightChange > 0 ? '+' : ''}
                          {weightChange !== null ? weightChange.toLocaleString('en-US') : '—'} kg
                        </p>

                        <p className="text-text-secondary text-sm">{weightChangePercent !== null ? `(${weightChangePercent > 0 ? '+' : ''}${weightChangePercent.toLocaleString('en-US', { maximumFractionDigits: 1 })}%)` : '(Percentage cannot be calculated from 0 kg)'}</p>
                      </div>

                      <p className="text-text-muted mt-2 text-xs">
                        First: {first.weight} kg · Latest: {current.weight} kg
                      </p>
                    </div>
                  )}

                  {isPlank && first && current && (
                    <div className="border-border bg-surface/50 mt-4 rounded-xl border p-4">
                      <h3 className="text-text-secondary text-sm font-medium">Time Progress Since First Entry</h3>

                      <p className="text-text-secondary mt-2 text-sm">
                        First: {first.seconds ?? 0} seconds
                        {' · '}
                        Latest: {current.seconds ?? 0} seconds
                      </p>
                    </div>
                  )}

                  <div className="mt-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h3 className="text-text text-lg font-semibold">Progress Over Time</h3>
                        <p className="text-text-muted mt-1 text-sm">{isPlank ? 'Track how long you can hold a plank.' : 'Choose which metric you want to track in the chart.'}</p>
                      </div>

                      <div className="border-border bg-background inline-flex w-fit rounded-xl border p-1" role="group" aria-label="Select chart metric">
                        {isPlank ? (
                          <span className="bg-info/15 text-info rounded-lg px-4 py-2 text-sm">Time (seconds)</span>
                        ) : (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setChartMetric('weight')}
                              ariaPressed={activeChartMetric === 'weight'}
                              className={`rounded-lg px-4 py-2 text-sm transition ${activeChartMetric === 'weight' ? 'bg-info/15 text-info' : 'text-text-secondary hover:text-text'}`}
                            >
                              Weight (kg)
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setChartMetric('reps')}
                              ariaPressed={activeChartMetric === 'reps'}
                              className={`rounded-lg px-4 py-2 text-sm transition ${activeChartMetric === 'reps' ? 'bg-info/15 text-info' : 'text-text-secondary hover:text-text'}`}
                            >
                              Reps
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    <ExerciseChart history={history} metric={activeChartMetric} />
                  </div>

                  <div className="mt-8">
                    <div className="mb-5">
                      <h3 className="text-text text-lg font-semibold">Training History</h3>
                      <p className="text-text-muted mt-1 text-sm">Your results and sets for each training day.</p>
                    </div>

                    <div className="mb-5 grid grid-cols-2 gap-3">
                      <div className="border-border bg-surface/50 rounded-xl border p-4">
                        <p className="text-text-secondary text-sm">Training Days</p>
                        <p className="text-text mt-2 text-2xl font-bold">{trainingDays}</p>
                      </div>

                      <div className="border-border bg-surface/50 rounded-xl border p-4">
                        <p className="text-text-secondary text-sm">Total Sets</p>
                        <p className="text-primary mt-2 text-2xl font-bold">{history.length}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {Array.from(
                        history.reduce((groups, entry) => {
                          const dateKey = new Date(entry.loggedAt).toLocaleDateString('en-CA');

                          const existing = groups.get(dateKey) ?? [];
                          existing.push(entry);
                          groups.set(dateKey, existing);

                          return groups;
                        }, new Map<string, typeof history>()),
                      )
                        .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                        .map(([dateKey, entries]) => (
                          <div key={dateKey} className="border-border hover:border-border-hover overflow-hidden rounded-2xl border transition-colors">
                            <div className="border-border bg-surface/70 flex items-center justify-between gap-3 border-b px-4 py-4 sm:px-5">
                              <div>
                                <h4 className="text-text font-semibold">
                                  {new Date(`${dateKey}T12:00:00`).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </h4>

                                <p className="text-text-muted mt-1 text-xs">
                                  {entries.length} {entries.length === 1 ? 'set recorded' : 'sets recorded'}
                                </p>
                              </div>

                              <span className="border-primary/20 bg-primary/10 text-primary inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold">
                                <Repeat2 className="h-4 w-4" />
                                {entries.length} sets
                              </span>
                            </div>

                            <div className="divide-border/70 divide-y">
                              {entries.map((entry, index) => {
                                const isWeightRecord = newWeightRecords.has(entry);
                                const isRepsRecord = newRepsRecords.has(entry);
                                const isSecondsRecord = newSecondsRecords.has(entry);

                                return (
                                  <div key={`${entry.loggedAt}-${index}`} className="hover:bg-surface-hover/20 flex items-center justify-between gap-3 px-4 py-4 transition-colors sm:px-5">
                                    <div className="flex min-w-0 items-center gap-3">
                                      <div className="border-border bg-surface-secondary/80 text-text-secondary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold">{index + 1}</div>

                                      <div className="min-w-0">
                                        <p className="text-text font-semibold">{isPlank ? `${entry.seconds ?? 0} seconds` : `${entry.weight ?? 0} kg × ${entry.reps} reps`}</p>

                                        <p className="text-text-muted mt-1 text-xs">Set {index + 1}</p>
                                      </div>
                                    </div>

                                    <div className="flex shrink-0 flex-col items-end gap-2">
                                      {isPlank && isSecondsRecord && <RecordBadge label="Time Record" />}

                                      {!isPlank && isWeightRecord && <RecordBadge label="Weight Record" />}

                                      {!isPlank && isRepsRecord && <RecordBadge label="Reps Record" variant="green" />}
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
                <p className="border-border bg-surface/50 text-text-secondary mt-5 rounded-xl border p-4 text-sm">No results have been recorded for this exercise yet.</p>
              )}
            </>
          )}
        </>
      ) : (
        <p className="border-border bg-surface/50 text-text-secondary mt-6 rounded-xl border p-4 text-sm">No training history available yet. Complete a workout and record your results to start tracking your progress.</p>
      )}
    </section>
  );
}

function RecordBadge({ label, variant = 'purple' }: { label: string; variant?: 'purple' | 'green' }) {
  const colors = variant === 'green' ? 'bg-success/10 text-success' : 'bg-info/10 text-info';

  return (
    <span className={`rounded-md px-2 py-1 text-xs font-medium ${colors}`}>
      <Trophy className="mr-1 inline h-3 w-3" />
      {label}
    </span>
  );
}

function StatCard({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: React.ReactNode }) {
  return (
    <div className="border-border bg-surface/50 rounded-xl border p-4">
      <div className="text-text-muted flex items-center gap-2">
        {icon}
        <p className="text-xs font-medium tracking-wider uppercase">{label}</p>
      </div>

      <p className="text-text mt-3 text-2xl font-bold">{value}</p>
      <p className="text-text-muted mt-1 text-xs">{detail}</p>
    </div>
  );
}
