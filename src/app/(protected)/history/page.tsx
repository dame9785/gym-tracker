//FA-Icons
import { History } from 'lucide-react';

//Services
import HistoryService from '@/services/history-service';
import { getTokenFromCookieStore } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import HistoryTopStats from '@/components/history/history-top-stats';
import HistoryMiddleStats from '@/components/history/history-middle-stats';
import WorkoutSessions from '@/components/history/workout-sessions';
import HistoryPagination from '@/components/history/history-pagination';
import HistoryHeader from '@/components/history/history-header';
import ErrorMessage from '@/components/ui/error-message';

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function HistoryPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const token = await getTokenFromCookieStore();
  if (!token) {
    redirect('/account/login');
  }

  const response = await HistoryService.getHistory(token, page);
  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage title="Unable to load foods" message={response.message ?? 'Something went wrong while loading your foods.'} />
      </main>
    );
  }

  const historyData = response.data.history;
  const totalTrainingTime = response.data.history.totalTrainingTime;
  const totalCompletedSets = response.data.history.totalCompletedSets;
  const workoutSessions = response.data.history.workoutSessions;
  const pagination = response.data.pagination;

  return (
    <div className="mx-auto max-w-7xl p-8">
      {/* History Header*/}
      <HistoryHeader />

      {/* History stats*/}
      <HistoryTopStats data={historyData} />

      {/* Training time stats*/}
      <HistoryMiddleStats totalTrainingTime={totalTrainingTime} totalCompletedSets={totalCompletedSets} />

      {/* Training time stats*/}
      <WorkoutSessions workoutSessions={workoutSessions} />

      <HistoryPagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
    </div>
  );
}
