'use client';

import Link from 'next/link';
//Auth
import { useAuth } from '@/provider/auth-provider';
export default function DashboardHeader() {
  const today = new Date();
  const { user } = useAuth();

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
      <div className="flex items-center gap-3">
        <button className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 transition hover:border-orange-500">🔔</button>
        <Link href={`account/settings/${user?.id}`} className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 transition hover:border-orange-500">
          ⚙️
        </Link>
      </div>
    </header>
  );
}
