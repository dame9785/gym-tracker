//FA-Icons
import { History } from 'lucide-react';

//Services
import HistoryService from '@/services/history-service';
import { getTokenFromCookieStore } from '@/lib/auth';
import { notFound } from 'next/navigation';
import HistoryTopStats from '@/components/history/history-top-stats';
import HistoryMiddleStats from '@/components/history/history-middle-stats';

export default async function HistoryPage() {
  const token = await getTokenFromCookieStore();

  if (!token) {
    notFound();
  }

  const response = await HistoryService.getHistory(token);
  console.log(response);
  if (!response.success) {
    notFound();
  }

  const historyData = response.data.history;
  const totalTrainingTime = response.data.history.totalTrainingTime;
  const totalCompletedSets = response.data.history.totalCompletedSets;
  const workoutSessions = response.data.history.workoutSessions;

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-10 flex items-center gap-4">
        <div className="rounded-2xl bg-orange-500 p-3">
          <History className="h-8 w-8 text-white" />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white">Workout History</h1>
          <p className="text-zinc-400">Review your completed workouts</p>
        </div>
      </div>

      {/* History stats*/}
      <HistoryTopStats data={historyData} />

      {/* Training time stats*/}
      <HistoryMiddleStats totalTrainingTime={totalTrainingTime} totalCompletedSets={totalCompletedSets} />
    </div>
  );
}
