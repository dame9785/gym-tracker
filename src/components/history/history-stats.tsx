import { HistoryViewModel } from '@/types/history-types';

type Props = {
  data: HistoryViewModel;
};

export default function HistoryHeader({ data }: Props) {
  const remaining = data.totalWorkouts - data.totalCompletedWorkouts;

  return (
    <div className="mb-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {/* Total Workouts */}
      <div className="group rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-800/70 p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-400">Total Workouts</p>
            <p className="mt-3 text-4xl font-bold tracking-tight text-white">{data.totalWorkouts}</p>
            <p className="mt-2 text-xs text-zinc-500">All scheduled workouts</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl">🏋️</div>
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
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-xl">✓</div>
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
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-xl">⏳</div>
        </div>
      </div>
    </div>
  );
}
