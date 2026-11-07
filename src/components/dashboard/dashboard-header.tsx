'use client';

export default function DashboardHeader() {
  const today = new Date();

  return (
    <header className="flex min-w-0 items-center justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-400">Welcome back 👋</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">Dashboard</h1>

        <p className="mt-2 text-sm leading-5 text-zinc-500 sm:text-base">
          {today.toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>
    </header>
  );
}
