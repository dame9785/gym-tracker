import Statistic from '@/components/log-weight/log-weight-statistics';
import LogHistoryList from '@/components/log-weight/log-history-list';
import Pagination from '@/components/ui/pagination';

import ErrorMessage from '@/components/ui/error-message';
import Header from '@/components/ui/header';

import GoalProgress from '@/components/progress/progress-goal';
import WeightProgressChart from '@/components/log-weight/weight-progress-chart';

import { WeightLogService } from '@/services/weight-log-service';
import ProgressService from '@/services/progress-service';
import { requireAuth } from '@/lib/auth';
import EmptyState from '@/components/ui/empty-state';

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function LogWeight({ searchParams }: Props) {
  const params = await searchParams;
  const parsedPage = Number(params.page);
  const page = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const user = await requireAuth();

  const weightLogService = new WeightLogService();
  const progressService = new ProgressService();

  let response: Awaited<ReturnType<typeof weightLogService.getAll>>;

  try {
    response = await weightLogService.getAll(page, user.userId);
  } catch (error: unknown) {
    console.error('Failed to load weight history:', error);

    return (
      <main className="w-full min-w-0">
        <ErrorMessage title="Unable to load weight history" message="We couldn't retrieve your weight history. Please try again later." />
      </main>
    );
  }

  if (!response.success || !response.data) {
    return (
      <main className="w-full min-w-0">
        <ErrorMessage title="Unable to load weight history" message="Something went wrong while loading your weight history." />
      </main>
    );
  }

  let weightProgress: Awaited<ReturnType<typeof progressService.getProgress>>['weightProgress'] | undefined;

  let progressError = false;

  try {
    const progressResponse = await progressService.getProgress(user.userId);
    weightProgress = progressResponse.weightProgress;
  } catch (error: unknown) {
    console.error('Failed to load weight progress:', error);
    progressError = true;
  }

  const data = response.data;

  const logList = data.logList;
  const currentWeight = data.currentWeight;
  const startWeight = data.startWeight;
  const currentPage = data.pagination.currentPage;
  const totalPage = data.pagination.totalPages;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Header
        title="YOUR PROGRESS"
        subTitle="Weight tracking"
        description="Track your weight over time and monitor your progress towards your fitness goals."
        actions={[
          {
            label: 'Add weight',
            href: '/log-weight/create',
          },
        ]}
      />

      {/* Statistics */}
      <div className="mb-6 min-w-0 sm:mb-8">
        <Statistic currentWeight={currentWeight} startWeight={startWeight} />
      </div>

      {/* Goal Progress and Weight Chart */}
      {progressError ? (
        <div className="mb-6 sm:mb-8">
          <ErrorMessage title="Unable to load weight progress" message="We couldn't retrieve your weight progress. Please try again later." />
        </div>
      ) : (
        weightProgress && (
          <>
            {/* Goal Progress */}
            <div className="mb-6 min-w-0 sm:mb-8">
              <GoalProgress weightData={weightProgress} />
            </div>

            {/* Weight Progress Chart */}
            <div className="mb-6 min-w-0 sm:mb-10">
              <WeightProgressChart history={weightProgress.history} startWeight={weightProgress.startWeight} goalWeight={weightProgress.goalWeight} />
            </div>
          </>
        )
      )}

      {/* Weight History */}
      <section className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6" id="history-section-weight">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Weight History</h2>

            <p className="mt-1 text-xs text-zinc-500">Your previous weight entries</p>
          </div>

          <span className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-400">{logList.length} entries</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {logList.length > 0 ? (
            logList.map((item) => <LogHistoryList key={item.id} logItem={item} />)
          ) : (
            <div className="col-span-full">
              <EmptyState title="No weight entries yet" description="Your logged weights will appear here." />
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPage > 1 && (
        <div className="mt-4 min-w-0">
          <Pagination currentPage={currentPage} totalPages={totalPage} basePath="/log-weight" ariaLabel="Weight log pagination" />
        </div>
      )}
    </section>
  );
}
