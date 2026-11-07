
import { redirect } from 'next/navigation';

// Services
import { HistoryService } from '@/services/history-service';
import { requireAuth } from '@/lib/auth';

// Components
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

const historyService = new HistoryService();

export default async function HistoryPage({ searchParams }: Props) {
  const user = await requireAuth();

  const params = await searchParams;

  const parsedPage = Number(params.page ?? '1');
  const page =
    Number.isSafeInteger(parsedPage) && parsedPage >= 1
      ? parsedPage
      : 1;

  const response = await historyService.getHistory(page, user.userId);

  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage
          title="Unable to load workout history"
          message={
            response.message ??
            'Something went wrong while loading your workout history.'
          }
        />
      </main>
    );
  }

  const historyData = response.data.history;
  const totalTrainingTime = historyData.totalTrainingTime;
  const totalCompletedSets = historyData.totalCompletedSets;
  const workoutSessions = historyData.workoutSessions;
  const pagination = response.data.pagination;

  // Redirect to the last valid page if the requested page is too high.
  if (pagination.totalPages > 0 && page > pagination.totalPages) {
    redirect(
      pagination.totalPages === 1
        ? '/history'
        : `/history?page=${pagination.totalPages}`
    );
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl px-0 py-8">
      <HistoryHeader />

      <HistoryTopStats data={historyData} />

      <HistoryMiddleStats
        totalTrainingTime={totalTrainingTime}
        totalCompletedSets={totalCompletedSets}
      />

      <WorkoutSessions workoutSessions={workoutSessions} />

      <HistoryPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
      />
    </div>
  );
}
