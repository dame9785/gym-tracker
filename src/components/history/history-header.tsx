import { History } from 'lucide-react';

export default function HistoryHeader() {
  return (
    <div className="mb-10 flex items-center gap-4">
      <div className="rounded-2xl bg-orange-500 p-3">
        <History className="h-8 w-8 text-white" />
      </div>

      <div>
        <h1 className="text-4xl font-bold text-white">Workout History</h1>

        <p className="text-zinc-400">Review your completed workouts</p>
      </div>
    </div>
  );
}
