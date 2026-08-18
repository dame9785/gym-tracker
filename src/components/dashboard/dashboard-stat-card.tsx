export type DashboardStatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
};

export default function DashboardStatCard({ icon, title, value, subtitle }: DashboardStatCardProps) {
  return (
    <div
      className="
        group relative overflow-hidden
        rounded-2xl border border-zinc-800
        bg-gradient-to-br from-zinc-900 to-zinc-950
        p-6
        transition-all duration-300
        hover:-translate-y-1
        hover:border-orange-500/40
        hover:shadow-xl
        hover:shadow-orange-500/5
      "
    >
      {/* Subtle accent */}
      <div
        className="
          absolute left-0 top-0 h-px w-full
          bg-gradient-to-r
          from-orange-500/60
          via-orange-500/20
          to-transparent
        "
      />

      {/* Icon */}
      <div
        className="
          flex h-11 w-11
          items-center justify-center
          rounded-xl
          bg-orange-500/10
          text-2xl
          transition-all duration-300
          group-hover:scale-110
          group-hover:bg-orange-500/15
        "
      >
        {icon}
      </div>

      {/* Value */}
      <p
        className="
          mt-6
          text-3xl
          font-bold
          tracking-tight
          text-white
        "
      >
        {value}
      </p>

      {/* Title */}
      <p
        className="
          mt-1
          text-sm
          font-semibold
          text-zinc-300
        "
      >
        {title}
      </p>

      {/* Subtitle */}
      {subtitle && <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>}
    </div>
  );
}
