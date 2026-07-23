import { WeeklySummaryViewModel } from '@/view-models/dashboard-view-model';

interface WeeklySummaryProps {
  summary: WeeklySummaryViewModel;
}

export default function WeeklySummary({ summary }: WeeklySummaryProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-6 text-xl font-semibold">Weekly Summary</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>📅 Workouts</span>
          <span className="font-bold">{summary.workouts}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>🔥 Streak</span>
          <span className="font-bold">{summary.streak} days</span>
        </div>

        <div className="flex items-center justify-between">
          <span>⏱ Training Time</span>
          <span className="font-bold">{summary.trainingTime} min</span>
        </div>
      </div>
    </div>
  );
}
