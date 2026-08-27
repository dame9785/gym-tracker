type ProfileStatProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

export default function ProfileStat({ icon, label, value }: ProfileStatProps) {
  return (
    <div className="min-w-22.5 rounded-xl border border-white/5 bg-black/20 p-3">
      <div className="mb-2 size-4 text-slate-400">{icon}</div>

      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
