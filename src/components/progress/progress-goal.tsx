import { Target, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';
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
            <h2 className="font-semibold text-white">Målprogression</h2>
            <p className="text-sm text-zinc-400">Ingen viktdata tillgänglig ännu.</p>
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
        <h2 className="font-semibold text-white">Målprogression</h2>
        <p className="mt-2 text-sm text-zinc-400">Kontrollera viktuppgifterna för att visa din målprogression.</p>
      </section>
    );
  }

  const totalChange = goal - start;
  const currentChange = current - start;
  const remaining = Math.abs(goal - current);
  const isGoalReached = totalChange === 0 || (totalChange > 0 ? current >= goal : current <= goal);

  const percentage = totalChange === 0 ? 100 : Math.min(100, Math.max(0, (currentChange / totalChange) * 100));

  const formatWeight = (value: number) =>
    value.toLocaleString('sv-SE', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

  const changeLabel = currentChange > 0 ? `+${formatWeight(currentChange)} kg` : `${formatWeight(currentChange)} kg`;

  return (
    <section className="mb-10 overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-400">Ditt mål</p>
            <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">Målprogression</h2>
            <p className="mt-1 text-sm text-zinc-400">Din utveckling från startvikt till målvikt</p>
          </div>
        </div>

        <div className="rounded-xl border border-purple-400/20 bg-purple-500/[0.06] px-4 py-3 sm:text-right">
          <p className="text-sm text-zinc-400">Måluppfyllelse</p>
          <p className="mt-1 text-3xl font-extrabold text-purple-400">{percentage.toFixed(0)}%</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Startvikt</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {formatWeight(start)} <span className="text-sm text-zinc-500">kg</span>
          </p>
        </div>

        <div className="rounded-xl border border-blue-400/15 bg-blue-500/[0.05] p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Nuvarande vikt</p>
          <p className="mt-2 text-2xl font-bold text-blue-400">
            {formatWeight(current)} <span className="text-sm text-zinc-500">kg</span>
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
            {currentChange >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {changeLabel} sedan start
          </p>
        </div>

        <div className="rounded-xl border border-purple-400/15 bg-purple-500/[0.05] p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Målvikt</p>
          <p className="mt-2 text-2xl font-bold text-purple-400">
            {formatWeight(goal)} <span className="text-sm text-zinc-500">kg</span>
          </p>
        </div>
      </div>

      <div className="mt-7">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-zinc-300">{isGoalReached ? 'Målet är uppnått!' : 'Framsteg mot målet'}</p>
          <p className="text-sm font-semibold text-purple-300">{percentage.toFixed(0)}%</p>
        </div>

        <div
          className="h-3 overflow-hidden rounded-full bg-zinc-800"
          role="progressbar"
          aria-label="Måluppfyllelse"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percentage)}
        >
          <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-700" style={{ width: `${percentage}%` }} />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-white/5 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-400">
          {isGoalReached ? (
            <span className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Du har nått eller passerat ditt viktmål.
            </span>
          ) : (
            <>
              Kvar till målet: <span className="font-semibold text-white">{formatWeight(remaining)} kg</span>
            </>
          )}
        </p>

        <p className="text-xs text-zinc-500">{totalChange > 0 ? 'Mål: öka i vikt' : totalChange < 0 ? 'Mål: minska i vikt' : 'Startvikten är samma som målet'}</p>
      </div>
    </section>
  );
}
