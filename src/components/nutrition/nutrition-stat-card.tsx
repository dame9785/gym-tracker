import type { LucideIcon } from 'lucide-react';

type Props = {
  label: string;
  value: number;
  target: number | null;
  unit: string;
  icon: LucideIcon;
  color: string;
  progressColor: string;
  background: string;
};

export default function NutritionStatCard({ label, value, target, unit, icon: Icon, color, progressColor, background }: Props) {
  const progress = target !== null && target > 0 ? Math.min((value / target) * 100, 100) : null;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-3">
      <div className="flex items-center gap-2">
        <div className={`rounded-md p-1.5 ${background}`}>
          <Icon size={16} className={color} />
        </div>

        <p className="text-xs text-zinc-400">{label}</p>
      </div>

      <p className="mt-2 text-xl font-bold text-white">
        {Math.round(value)}
        <span className="ml-1 text-xs font-normal text-zinc-500">{unit}</span>
      </p>

      {target !== null && (
        <>
          <p className="mt-1 text-xs text-zinc-500">
            Goal: {target} {unit}
          </p>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div className={`h-full rounded-full transition-all ${progressColor}`} style={{ width: `${progress ?? 0}%` }} />
          </div>

          <p className="mt-1 text-right text-xs text-zinc-500">{Math.round(progress ?? 0)}%</p>
        </>
      )}
    </div>
  );
}
