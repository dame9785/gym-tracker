import { redirect } from 'next/navigation';

import { HistoryService } from '@/services/history-service';
import { requireAuth } from '@/lib/auth';

import HistoryTopStats from '@/components/history/history-top-stats';
import HistoryMiddleStats from '@/components/history/history-middle-stats';
import WorkoutSessions from '@/components/history/workout-sessions';

import ErrorMessage from '@/components/ui/error-message';
import Header from '@/components/ui/header';
import Pagination from '@/components/ui/pagination';
import PageContainer from '@/components/layout/page-container';

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function HistoryPage({ searchParams }: Props) {
  const user = await requireAuth();
  const params = await searchParams;

  const parsedPage = Number(params.page ?? '1');

  const page = Number.isSafeInteger(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  const historyService = new HistoryService();

  let response: Awaited<ReturnType<typeof historyService.getHistory>>;

  try {
    response = await historyService.getHistory(page, user.userId);
  } catch (error: unknown) {
    console.error('Failed to load workout history:', error);

    return (
      <PageContainer>
        <ErrorMessage title="Unable to load workout history" message="Something went wrong while loading your workout history. Please try again later." />
      </PageContainer>
    );
  }

  if (!response.success || !response.data) {
    return (
      <PageContainer>
        <ErrorMessage title="Unable to load workout history" message="Something went wrong while loading your workout history." />
      </PageContainer>
    );
  }

  const historyData = response.data.history;
  const pagination = response.data.pagination;

  // Redirect to the last valid page if the requested page is too high.
  if (page > Math.max(pagination.totalPages, 1)) {
    redirect(pagination.totalPages <= 1 ? '/history' : `/history?page=${pagination.totalPages}`);
  }

  return (
    <PageContainer>
      <Header title="WORKOUT HISTORY" subTitle="History" description="Review your completed workouts, track your training activity, and look back on your fitness journey." />

      {/* History statistics */}
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <HistoryTopStats data={historyData} />

        <HistoryMiddleStats totalTrainingTime={historyData.totalTrainingTime} totalCompletedSets={historyData.totalCompletedSets} />
      </div>

      {/* Workout sessions */}
      <WorkoutSessions workoutSessions={historyData.workoutSessions} />

      {/* Pagination */}
      {pagination.totalPages > 1 && <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} basePath="/history" ariaLabel="Workout history pagination" />}
    </PageContainer>
  );
}
