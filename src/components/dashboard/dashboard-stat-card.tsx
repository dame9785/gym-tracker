export type DashboardStatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
};

export default function DashboardStatCard({ icon, title, value, subtitle }: DashboardStatCardProps) {
  console.log(icon, title, value, subtitle);
  switch (title) {
    case 'Workouts this week':
      value = value + ' ' + 'Workouts';
      break;
    case 'Current streak':
      value = value + ' ' + 'Days';
      break;
  }

  return (
    <div className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-950 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/5 sm:rounded-2xl sm:p-5 lg:p-6">
      <div className="absolute top-0 left-0 h-px w-full bg-linear-to-r from-orange-500/60 via-orange-500/20 to-transparent" />

      <div className="flex flex-2 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-orange-500/15 sm:h-11 sm:w-11 sm:rounded-xl sm:text-2xl">{icon}</div>

        <h3 className="mt-3 min-w-0 text-2xl font-bold tracking-tight wrap-break-word text-orange-400 sm:mt-6 sm:text-4xl lg:text-4xl xl:text-[40px]">{value}</h3>
      </div>

      <b className="mt-1 min-w-0 text-lg leading-snug font-bold wrap-break-word text-zinc-300">{title}</b>

      {subtitle && <p className="mt-1 min-w-0 text-sm leading-snug wrap-break-word text-zinc-500">{subtitle}</p>}
    </div>
  );
}
