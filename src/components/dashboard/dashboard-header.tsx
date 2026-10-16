'use client';

export default function DashboardHeader() {
  const today = new Date();

  return (
    <header className="flex items-center justify-between">
      <div>
        <p className="text-sm text-zinc-400">Welcome back 👋</p>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-zinc-500">
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
