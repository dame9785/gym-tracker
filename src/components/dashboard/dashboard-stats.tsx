
export type DashboardStatCardProps = {
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
    <div
      className="
        group relative flex min-w-0 flex-col overflow-hidden
        rounded-xl border border-zinc-800
        bg-gradient-to-br from-zinc-900 to-zinc-950
        p-3 sm:rounded-2xl sm:p-5 lg:p-6
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
          flex h-9 w-9 shrink-0 items-center justify-center
          rounded-lg bg-orange-500/10
          text-xl
          transition-all duration-300
          sm:h-11 sm:w-11 sm:rounded-xl sm:text-2xl
          group-hover:scale-110
          group-hover:bg-orange-500/15
        "
      >
        {icon}
      </div>

      {/* Value */}
      <p
        className="
          mt-3 min-w-0 break-words
          text-2xl font-bold tracking-tight text-white
          sm:mt-6 sm:text-3xl
        "
      >
        {value}
      </p>

      {/* Title */}
      <p
        className="
          mt-1 min-w-0 break-words
          text-sm font-semibold leading-snug text-zinc-300
        "
      >
        {title}
      </p>

      {/* Subtitle */}
      {subtitle && (
        <p
          className="
            mt-1 min-w-0 break-words
            text-sm leading-snug text-zinc-500
          "
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
