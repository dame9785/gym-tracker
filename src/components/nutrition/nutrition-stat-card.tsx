import type { LucideIcon } from 'lucide-react';

import Card from '@/components/ui/card';

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
    <Card variant="interactive" accent padding="sm" className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${background}`}>
          <Icon size={17} className={color} />
        </div>

        <p className="text-text-secondary text-sm font-medium tracking-tight">{label}</p>
      </div>

      {/* Value */}
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="text-text text-2xl font-semibold tracking-tight">{Math.round(value)}</span>

        <span className="text-text-muted text-xs font-medium">{unit}</span>
      </div>

      {/* Goal and progress */}
      {target !== null && (
        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-text-muted text-xs">
              Goal{' '}
              <span className="text-text-secondary">
                {target} {unit}
              </span>
            </p>

            <span className="text-text-secondary text-xs font-medium">{Math.round(progress ?? 0)}%</span>
          </div>

          <div className="bg-surface-secondary mt-2 h-1.5 overflow-hidden rounded-full">
            <div className={`h-full rounded-full transition-all duration-500 ${progressColor}`} style={{ width: `${progress ?? 0}%` }} />
          </div>
        </div>
      )}
    </Card>
  );
}
