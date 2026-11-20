'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProtectedError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <div role="alert" className="border-danger/20 bg-surface/60 w-full max-w-md rounded-2xl border p-8 text-center shadow-xl shadow-black/20">
        <div aria-hidden="true" className="border-danger/30 bg-danger/10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border">
          <AlertTriangle className="text-danger h-7 w-7" />
        </div>

        <h2 className="text-text text-xl font-semibold">Something went wrong</h2>

        <p className="text-text-muted mt-3 text-sm leading-6">An unexpected error occurred. Please try again.</p>

        <button type="button" onClick={() => reset()} className="bg-primary text-primary-foreground hover:bg-primary-hover mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition">
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </main>
  );
}
