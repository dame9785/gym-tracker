import type { ReactNode } from 'react';

import Card from '@/components/ui/card';

export type StatsCardProps = {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
};

export default function StatsCard({ icon, title, value, subtitle, className = '' }: StatsCardProps) {
  return (
    <Card variant="interactive" accent className={`flex min-h-30 items-center justify-between gap-3 sm:min-h-37.5 sm:gap-4 ${className}`}>
      {/* Icon */}
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-500/15 bg-orange-500/10 text-xl text-orange-400 transition-all duration-300 group-hover:scale-105 group-hover:border-orange-500/25 group-hover:bg-orange-500/15 sm:h-14 sm:w-14 sm:text-2xl">
          <span aria-hidden="true">{icon}</span>
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-100 sm:text-base">{title}</h3>

          {subtitle && <p className="mt-1 text-xs leading-5 text-zinc-500 sm:text-sm sm:leading-6">{subtitle}</p>}
        </div>
      </div>

      {/* Value */}
      <div className="shrink-0 text-right">
        <span className="text-base font-semibold tracking-tight text-orange-400 sm:text-lg lg:text-xl">{value}</span>
      </div>
    </Card>
  );
}
