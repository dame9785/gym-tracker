import { CalendarDays, Clock3, Flame } from 'lucide-react';

// Types
import type { WeeklySummaryViewModel } from '@/types/dashboard-types';

// Props
interface WeeklySummaryProps {
  summary: WeeklySummaryViewModel;
}

export default function WeeklySummary({ summary }: WeeklySummaryProps) {
  return (
    <div
      className="
        rounded-2xl border border-zinc-800
        bg-gradient-to-br from-zinc-900 to-zinc-950
        p-6
      "
    >
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Your progress</p>

        <h2 className="mt-1 text-xl font-bold text-white">Weekly Summary</h2>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        {/* Workouts */}
        <div
          className="
            flex items-center justify-between
            rounded-xl border border-zinc-800/80
            bg-zinc-900/60 p-4
            transition-colors duration-200
            hover:border-orange-500/30
            hover:bg-zinc-800/60
          "
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <CalendarDays className="h-5 w-5 text-orange-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-200">Workouts</p>

              <p className="text-xs text-zinc-500">Completed this week</p>
            </div>
          </div>

          <span className="text-lg font-bold text-white">{summary.workouts}</span>
        </div>

        {/* Streak */}
        <div
          className="
            flex items-center justify-between
            rounded-xl border border-zinc-800/80
            bg-zinc-900/60 p-4
            transition-colors duration-200
            hover:border-red-500/30
            hover:bg-zinc-800/60
          "
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <Flame className="h-5 w-5 text-red-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-200">Streak</p>

              <p className="text-xs text-zinc-500">Current streak</p>
            </div>
          </div>

          <span className="text-lg font-bold text-white">
            {summary.streak}
            <span className="ml-1 text-xs font-medium text-zinc-500">days</span>
          </span>
        </div>

        {/* Training time */}
        <div
          className="
            flex items-center justify-between
            rounded-xl border border-zinc-800/80
            bg-zinc-900/60 p-4
            transition-colors duration-200
            hover:border-blue-500/30
            hover:bg-zinc-800/60
          "
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Clock3 className="h-5 w-5 text-blue-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-200">Training Time</p>

              <p className="text-xs text-zinc-500">Total this week</p>
            </div>
          </div>

          <span className="text-lg font-bold text-white">
            {summary.trainingTime}
            <span className="ml-1 text-xs font-medium text-zinc-500">min</span>
          </span>
        </div>
      </div>
    </div>
  );
}
