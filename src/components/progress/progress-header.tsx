import { Dumbbell } from 'lucide-react';

export default function ProgressHeader() {
  return (
    <header className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
        <Dumbbell className="h-6 w-6" />
      </div>

      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Din utveckling</h1>

        <p className="mt-1 text-sm leading-6 text-zinc-400">Följ dina träningsresultat och se dina framsteg över tid.</p>
      </div>
    </header>
  );
}
