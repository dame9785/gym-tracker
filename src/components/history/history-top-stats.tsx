import { HistoryViewModel } from '@/types/history-types';
import { CheckCircle2, Trophy, Dumbbell, Clock3 } from 'lucide-react';

type Props = {
  data: HistoryViewModel;
};

export default function HistoryTopStats({ data }: Props) {
  const remaining = data.totalWorkouts - data.totalCompletedWorkouts;

  const completionRate = data.totalWorkouts > 0 ? Math.round((data.totalCompletedWorkouts / data.totalWorkouts) * 100) : 0;

  return (
    <div className="mb-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {/* Total Workouts */}
      <div className="group rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-800/70 p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-400">Total Workouts</p>

            <p className="mt-3 text-4xl font-bold tracking-tight text-white">{data.totalWorkouts}</p>

            <p className="mt-2 text-xs text-zinc-500">All scheduled workouts</p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
            <Dumbbell className="h-5 w-5 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Completed */}
      <div className="group rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-800/70 p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-green-500/30 hover:shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-400">Completed</p>

            <p className="mt-3 text-4xl font-bold tracking-tight text-green-400">{data.totalCompletedWorkouts}</p>

            <p className="mt-2 text-xs text-zinc-500">Successfully completed</p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
          </div>
        </div>
      </div>

      {/* Remaining */}
      <div className="group rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-800/70 p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-400">Remaining</p>

            <p className="mt-3 text-4xl font-bold tracking-tight text-orange-400">{remaining}</p>

            <p className="mt-2 text-xs text-zinc-500">Workouts left to complete</p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10">
            <Clock3 className="h-5 w-5 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="group rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-800/70 p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-xl">
        <div className="flex items-start justify-between">
          <div className="w-full">
            <p className="text-sm font-medium text-zinc-400">Completion Rate</p>

            <p className="mt-3 text-4xl font-bold tracking-tight text-purple-400">{completionRate}%</p>

            <p className="mt-2 text-xs text-zinc-500">
              {data.totalCompletedWorkouts} of {data.totalWorkouts} workouts completed
            </p>

            {/* Progress bar */}
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-purple-500 transition-all duration-500"
                style={{
                  width: `${completionRate}%`,
                }}
              />
            </div>
          </div>

          <div className="ml-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
            <Trophy className="h-5 w-5 text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
