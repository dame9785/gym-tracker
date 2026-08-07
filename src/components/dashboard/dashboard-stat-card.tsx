type DashboardStatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
};

export default function DashboardStatCard({
  icon,
  title,
  value,
  subtitle,
}: DashboardStatCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10">
      <div className="mb-5 text-3xl">{icon}</div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-2 text-sm font-medium text-zinc-300">{title}</p>
      {subtitle && <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>}
    </div>
  );
}
