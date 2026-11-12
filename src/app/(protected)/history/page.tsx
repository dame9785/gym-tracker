import { redirect } from 'next/navigation';

import { HistoryService } from '@/services/history-service';
import { requireAuth } from '@/lib/auth';

import HistoryTopStats from '@/components/history/history-top-stats';
import HistoryMiddleStats from '@/components/history/history-middle-stats';
import WorkoutSessions from '@/components/history/workout-sessions';
import HistoryPagination from '@/components/history/history-pagination';

import ErrorMessage from '@/components/ui/error-message';
import Header from '@/components/ui/header';

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
      <main className="mx-auto w-full max-w-7xl px-0 py-8">
        <ErrorMessage title="Unable to load workout history" message="Something went wrong while loading your workout history. Please try again later." />
      </main>
    );
  }

  if (!response.success || !response.data) {
    return (
      <main className="mx-auto w-full max-w-7xl px-0 py-8">
        <ErrorMessage title="Unable to load workout history" message="Something went wrong while loading your workout history." />
      </main>
    );
  }

  const historyData = response.data.history;
  const pagination = response.data.pagination;

  // Redirect to the last valid page if the requested page is too high.
  if (page > Math.max(pagination.totalPages, 1)) {
    redirect(pagination.totalPages <= 1 ? '/history' : `/history?page=${pagination.totalPages}`);
  }

  return (
    <main className="mx-auto w-full max-w-7xl min-w-0 px-0 py-8">
      {/* Page header */}
      <section className="min-w-0">
        <Header title="WORKOUT HISTORY" subTitle="History" description="Review your completed workouts, track your training activity, and look back on your fitness journey." />
      </section>

      {/* Overall workout statistics */}
      <section className="mt-8">
        <HistoryTopStats data={historyData} />
      </section>

      {/* Training time and completed sets */}
      <section className="mt-5">
        <HistoryMiddleStats totalTrainingTime={historyData.totalTrainingTime} totalCompletedSets={historyData.totalCompletedSets} />
      </section>

      {/* Workout sessions */}
      <section className="mt-10">
        <WorkoutSessions workoutSessions={historyData.workoutSessions} />
      </section>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <section className="mt-8">
          <HistoryPagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        </section>
      )}
    </main>
  );
}
