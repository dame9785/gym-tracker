import type { ReactNode } from 'react';

export type StatsCardProps = {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
};

export default function StatsCard({ icon, title, value, subtitle }: StatsCardProps) {
  return (
    <div className="group relative flex min-h-30 min-w-0 items-center justify-between gap-2 overflow-hidden rounded-xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-950 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/5 sm:min-h-[155px] sm:gap-4 sm:rounded-2xl sm:p-5 lg:p-6">
      {/* Top accent */}
      <div className="absolute top-0 left-0 h-px w-full bg-linear-to-r from-orange-500/60 via-orange-500/20 to-transparent" />

      {/* Left content */}
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-xl text-zinc-100 transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14 sm:text-3xl">{icon}</div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base leading-snug font-bold tracking-wide text-zinc-200 sm:text-xl">{title}</h3>

          {subtitle && <p className="mt-1 text-xs leading-relaxed tracking-wide text-zinc-500 sm:text-base">{subtitle}</p>}
        </div>
      </div>

      {/* Right value */}
      <div className="min-w-0 shrink-0 text-right">
        <span className="text-lg leading-tight font-bold tracking-wide text-orange-400 sm:text-2xl lg:text-3xl">{value}</span>
      </div>
    </div>
  );
}
