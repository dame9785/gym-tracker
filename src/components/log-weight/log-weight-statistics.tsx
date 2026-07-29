type StatisticProps = {
  currentWeight?: string;
  startWeight?: string;
};

export default function Statistic({ currentWeight, startWeight }: StatisticProps) {
  const current = Number(currentWeight ?? 0);
  const start = Number(startWeight ?? 0);

  const difference = current - start;
  const isWeightGain = difference >= 0;
  return (
    <div className="mb-10 grid gap-5 md:grid-cols-3">
      {/* Current Weight */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <p className="text-sm text-orange-400">Nuvarande vikt</p>
        <h2 className="mt-2 text-3xl font-bold text-white">{currentWeight} kg</h2>
      </div>

      {/* Start Weight */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <p className="text-sm text-orange-400">Startvikt</p>
        <h2 className="mt-2 text-3xl font-bold text-white">{startWeight} kg</h2>
      </div>

      {/* Current Different */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <p className="text-sm text-orange-400">Förändring</p>
        <h2
          className={`mt-2 text-3xl font-bold ${isWeightGain ? 'text-green-400' : 'text-red-400'}`}
        >
          {difference > 0 ? '+' : ''}
          {difference.toFixed(1)} kg
        </h2>
      </div>
    </div>
  );
}
