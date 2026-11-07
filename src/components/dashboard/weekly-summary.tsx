
import { CalendarDays, Clock3, Flame } from 'lucide-react';

import type { WeeklySummaryViewModel } from '@/types/dashboard-types';

interface WeeklySummaryProps {
  summary: WeeklySummaryViewModel;
}

export default function WeeklySummary({ summary }: WeeklySummaryProps) {
  return (
    <div
      className="
        min-w-0 rounded-2xl border border-zinc-800
        bg-gradient-to-br from-zinc-900 to-zinc-950
        p-4 sm:p-6
      "
    >
      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Your progress
        </p>

        <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
          Weekly Summary
        </h2>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        {/* Workouts */}
        <div
          className="
            flex min-w-0 items-center justify-between gap-3
            rounded-xl border border-zinc-800/80
            bg-zinc-900/60 p-3 sm:p-4
            transition-colors duration-200
            hover:border-orange-500/30
            hover:bg-zinc-800/60
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
              <CalendarDays className="h-5 w-5 text-orange-400" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-200 sm:text-base">
                Workouts
              </p>

              <p className="text-xs text-zinc-500 sm:text-sm">
                Completed this week
              </p>
            </div>
          </div>

          <span className="shrink-0 text-lg font-bold text-white">
            {summary.workouts}
          </span>
        </div>

        {/* Streak */}
        <div
          className="
            flex min-w-0 items-center justify-between gap-3
            rounded-xl border border-zinc-800/80
            bg-zinc-900/60 p-3 sm:p-4
            transition-colors duration-200
            hover:border-red-500/30
            hover:bg-zinc-800/60
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
              <Flame className="h-5 w-5 text-red-400" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-200 sm:text-base">
                Streak
              </p>

              <p className="text-xs text-zinc-500 sm:text-sm">
                Current streak
              </p>
            </div>
          </div>

          <span className="shrink-0 text-lg font-bold text-white">
            {summary.streak}
            <span className="ml-1 text-xs font-medium text-zinc-500 sm:text-sm">
              days
            </span>
          </span>
        </div>

        {/* Training time */}
        <div
          className="
            flex min-w-0 items-center justify-between gap-3
            rounded-xl border border-zinc-800/80
            bg-zinc-900/60 p-3 sm:p-4
            transition-colors duration-200
            hover:border-blue-500/30
            hover:bg-zinc-800/60
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
              <Clock3 className="h-5 w-5 text-blue-400" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-200 sm:text-base">
                Training Time
              </p>

              <p className="text-xs text-zinc-500 sm:text-sm">
                Total this week
              </p>
            </div>
          </div>

          <span className="shrink-0 text-lg font-bold text-white">
            {summary.trainingTime}
            <span className="ml-1 text-xs font-medium text-zinc-500 sm:text-sm">
              min
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
