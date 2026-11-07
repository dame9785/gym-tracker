export type DashboardStatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
};

export default function DashboardStatCard({ icon, title, value, subtitle }: DashboardStatCardProps) {
  switch (title) {
    case 'Workouts this week':
      value = `${value} Workouts`;
      break;

    case 'Current streak':
      value = `${value} Days`;
      break;

    case 'Övningar':
      value = `${value} st`;
      break;

    case 'Planerade set':
      value = `${value} sets`;
      break;
  }

  return (
    <div className="group relative flex min-h-[140px] min-w-0 items-center justify-between gap-4 overflow-hidden rounded-xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-950 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/5 sm:min-h-[155px] sm:rounded-2xl sm:p-5 lg:p-6">
      {/* Top accent */}
      <div className="absolute top-0 left-0 h-px w-full bg-linear-to-r from-orange-500/60 via-orange-500/20 to-transparent" />

      {/* Left content */}
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-2xl text-zinc-100 transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14 sm:text-3xl">{icon}</div>

        <div className="min-w-0">
          <h3 className="text-lg leading-snug font-bold text-zinc-200 sm:text-xl">{title}</h3>

          {subtitle && <p className="mt-1 text-sm leading-relaxed text-zinc-500 sm:text-base">{subtitle}</p>}
        </div>
      </div>

      {/* Right value */}
      <div className="flex shrink-0 items-center justify-end pl-2">
        <span
          className="font-extrabold tracking-tight whitespace-nowrap text-orange-400"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 1rem)',
            lineHeight: 1,
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
