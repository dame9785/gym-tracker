import { Target, CheckCircle2 } from 'lucide-react';
import type { WeightProgress } from '@/types/progress-type';

type Props = {
  weightData: WeightProgress | null;
};

export default function GoalProgress({ weightData }: Props) {
  if (!weightData) {
    return (
      <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Target className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-white">Goal Progress</h2>
            <p className="text-sm text-zinc-400">No weight data available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  const current = Number(weightData.currentWeight);
  const start = Number(weightData.startWeight);
  const goal = Number(weightData.goalWeight);

  const valuesAreValid = Number.isFinite(current) && Number.isFinite(start) && Number.isFinite(goal) && current > 0 && start > 0 && goal > 0;

  if (!valuesAreValid) {
    return (
      <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="font-semibold text-white">Goal Progress</h2>
        <p className="mt-2 text-sm text-zinc-400">Check your weight data to view your progress toward your goal.</p>
      </section>
    );
  }

  const totalChange = goal - start;
  const currentChange = current - start;
  const remaining = Math.abs(goal - current);
  const distanceFromStart = Math.abs(current - start);

  const isWeightGainGoal = goal > start;
  const isWeightLossGoal = goal < start;

  const isBelowStart = isWeightGainGoal && current < start;
  const isAboveStart = isWeightLossGoal && current > start;

  const isGoalReached = totalChange === 0 || (isWeightGainGoal && current >= goal) || (isWeightLossGoal && current <= goal);

  const percentage = totalChange === 0 ? 100 : isGoalReached ? 100 : Math.min(100, Math.max(0, (currentChange / totalChange) * 100));

  const formatWeight = (value: number) =>
    value.toLocaleString('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

  return (
    <section className="mb-10 overflow-hidden rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
            <Target className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-orange-400 uppercase">YOUR GOAL</p>
            <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">Goal Progress</h2>
            <p className="mt-1 text-sm text-zinc-400">Your progress from starting weight to target weight</p>
          </div>
        </div>
      </div>

      {/* Main goal progress */}
      <div className="mt-7">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-zinc-300">{isGoalReached ? 'Goal achieved!' : 'Progress toward your goal'}</p>
          <p className="text-sm font-semibold text-orange-400">{percentage.toFixed(0)}%</p>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-zinc-800" role="progressbar" aria-label="Goal completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percentage)}>
          <div className="h-full rounded-full bg-linear-to-r from-orange-500 to-blue-500 transition-all duration-700" style={{ width: `${percentage}%` }} />
        </div>
      </div>

      {/* Goal information */}
      <div className="mt-5 flex flex-col gap-2 border-t border-white/5 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1 text-sm text-zinc-400">
          {isGoalReached ? (
            <span className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              You have reached or exceeded your weight goal.
            </span>
          ) : (
            <>
              <p>
                Remaining to goal: <span className="font-semibold text-white">{formatWeight(remaining)} kg</span>
              </p>

              {isBelowStart && <p className="text-amber-400">You are {formatWeight(distanceFromStart)} kg below your starting weight.</p>}

              {isAboveStart && <p className="text-amber-400">You are {formatWeight(distanceFromStart)} kg above your starting weight.</p>}
            </>
          )}
        </div>

        <p className="text-xs text-zinc-500">{totalChange > 0 ? 'Goal: Gain weight' : totalChange < 0 ? 'Goal: Lose weight' : 'Starting weight equals target weight'}</p>
      </div>
    </section>
  );
}
