import { Target } from 'lucide-react';
import type { WeightProgress } from '@/types/progress-type';

type Props = {
  weightData: WeightProgress | null;
};

export default function GoalProgress({ weightData }: Props) {
  const current = Number(weightData?.currentWeight ?? 0);
  const start = Number(weightData?.startWeight ?? 0);
  const goal = Number(weightData?.goalWeight ?? 0);

  const totalDistance = Math.abs(goal - start);
  const currentDistance = Math.abs(current - start);

  const percentage = totalDistance > 0 ? Math.min((currentDistance / totalDistance) * 100, 100) : 0;

  const remaining = Math.abs(goal - current);

  return (
    <div className="mb-10 rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-950 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Target className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-white">Goal progress</h2>

            <p className="text-sm text-zinc-500">Your progress towards your goal weight</p>
          </div>
        </div>

        <span className="text-2xl font-bold text-purple-400">{percentage.toFixed(0)}%</span>
      </div>

      {/* Weight values */}
      <div className="mt-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-600">Current</p>

          <p className="mt-1 text-2xl font-bold text-white">
            {current.toFixed(1)}
            <span className="ml-1 text-sm font-medium text-zinc-500">kg</span>
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-zinc-600">Goal</p>

          <p className="mt-1 text-2xl font-bold text-white">
            {goal.toFixed(1)}
            <span className="ml-1 text-sm font-medium text-zinc-500">kg</span>
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full rounded-full bg-linear-to-r from-purple-500 to-blue-500 transition-all duration-500" style={{ width: `${percentage}%` }} />
      </div>

      {/* Remaining */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-zinc-500">{remaining > 0 ? `${remaining.toFixed(1)} kg remaining` : 'Goal reached!'}</p>

        <p className="text-sm font-medium text-zinc-400">
          {current.toFixed(1)} / {goal.toFixed(1)} kg
        </p>
      </div>
    </div>
  );
}
