import { Scale, TrendingDown, TrendingUp } from 'lucide-react';
import type { WeightProgress } from '@/types/progress-type';

type Props = {
  weightData: WeightProgress | null;
};

export default function WeightProgress({ weightData }: Props) {
  const current = Number(weightData?.currentWeight ?? 0);
  const start = Number(weightData?.startWeight ?? 0);

  const difference = current - start;
  const isWeightGain = difference >= 0;
  return (
    <div className="mb-10 grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div className="group relative min-w-0 overflow-hidden rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-950 p-6">
        <div className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-orange-500/70 via-orange-500/20 to-transparent" />
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 transition-transform duration-300 group-hover:scale-110">
            <Scale className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">Start</span>
        </div>
        <p className="mt-6 text-sm font-medium text-zinc-400">Startvikt</p>
        <div className="mt-1 flex min-w-0 items-baseline gap-2">
          <h2 className="truncate text-3xl font-bold tracking-tight text-white">{weightData?.startWeight}</h2>
          <span className="shrink-0 text-sm font-medium text-zinc-500">kg</span>
        </div>
      </div>
      <div className="group relative min-w-0 overflow-hidden rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-950 p-6">
        <div className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-blue-500/70 via-blue-500/20 to-transparent" />
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition-transform duration-300 group-hover:scale-110">
            <Scale className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">Start</span>
        </div>
        <p className="mt-6 text-sm font-medium text-zinc-400">Nuvarande vikts</p>
        <div className="mt-1 flex min-w-0 items-baseline gap-2">
          <h2 className="truncate text-3xl font-bold tracking-tight text-white">{weightData?.currentWeight}</h2>
          <span className="shrink-0 text-sm font-medium text-zinc-500">kg</span>
        </div>
      </div>

      <div
        className={`
          group relative min-w-0 overflow-hidden
          rounded-2xl border
          bg-linear-to-br from-zinc-900 to-zinc-950
          p-6
          transition-all duration-300
          hover:-translate-y-1
          hover:shadow-xl
          ${isWeightGain ? 'border-green-500/30 hover:border-green-500/50 hover:shadow-green-500/5' : 'border-red-500/30 hover:border-red-500/50 hover:shadow-red-500/5'}
        `}
      >
        <div
          className={`
            absolute left-0 top-0 h-px w-full
            ${isWeightGain ? 'bg-linear-to-r from-green-500/70 via-green-500/20 to-transparent' : 'bg-linear-to-r from-red-500/70 via-red-500/20 to-transparent'}
          `}
        />

        <div className="flex items-center justify-between">
          <div
            className={`
              flex h-11 w-11 shrink-0 items-center justify-center
              rounded-xl
              ${isWeightGain ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}
              transition-transform duration-300
              group-hover:scale-110
            `}
          >
            {isWeightGain ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
          </div>
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">Progress</span>
        </div>

        <p className="mt-6 text-sm font-medium text-zinc-400">Förändring</p>
        <div className="mt-1 flex min-w-0 items-baseline gap-2">
          <h2 className={`truncate text-3xl font-bold tracking-tight${isWeightGain ? 'text-green-400' : 'text-red-400'}`}>
            {difference > 0 ? '+' : ''}
            {difference.toFixed(1)}
          </h2>
          <span className="shrink-0 text-sm font-medium text-zinc-500">kg</span>
        </div>
      </div>
    </div>
  );
}
