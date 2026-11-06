import Link from 'next/link';

import Statistic from '@/components/log-weight/log-weight-statistics';
import LogHistoryList from '@/components/log-weight/log-history-list';
import WeightChart from '@/components/log-weight/weight-chart';
import Pagination from '@/components/log-weight/log-pagination';
import Button from '@/components/button/button';

import { WeightLogService } from '@/services/weight-log-service';
import ErrorMessage from '@/components/ui/error-message';
import { requireAuth } from '@/lib/auth';

import ProgressService from '@/services/progress-service';
import GoalProgress from '@/components/progress/progress-goal';
import WeightProgressChart from '@/components/log-weight/weight-progress-chart';

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

const weightLogService = new WeightLogService();
const progressService = new ProgressService();

export default async function LogWeight({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const user = await requireAuth();

  const response = await weightLogService.getAll(page, user.userId);

  const progressResponse = await progressService.getProgress(user.userId);
  const weightProgress = progressResponse.weightProgress;

  if (!response.success || !response.data) {
    return (
      <main className="w-full min-w-0">
        <ErrorMessage title="Unable to load weight history" message={response.message ?? 'Something went wrong while loading your weight history.'} />
      </main>
    );
  }

  const data = response.data;

  const LogList = data.logList;
  const currentWeight = data.currentWeight;
  const startWeight = data.startWeight;
  const currentPage = data.pagination.currentPage;
  const totalPage = data.pagination.totalPages;

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl px-0">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Weight</h1>

          <p className="mt-2 text-sm text-zinc-400 sm:text-base">Track your weight over time.</p>
        </div>

        <div className="w-full sm:w-auto">
          <Link href="/log-weight/create" className="block">
            <Button type="button" variant="primary">
              Log weight
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-6 min-w-0 sm:mb-8">
        <Statistic currentWeight={currentWeight} startWeight={startWeight} />
      </div>

      {/* Goal Progress */}
      {weightProgress && (
        <div className="mb-6 min-w-0 sm:mb-8">
          <GoalProgress weightData={weightProgress} />
        </div>
      )}

      {/* Weight Progress Chart */}
      {weightProgress && (
        <div className="mb-6 min-w-0 sm:mb-10">
          <WeightProgressChart history={weightProgress.history} startWeight={weightProgress.startWeight} goalWeight={weightProgress.goalWeight} />
        </div>
      )}

     

      {/* Weight History */}
      <section className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6" id="history-section-weight">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Weight History</h2>

            <p className="mt-1 text-xs text-zinc-500">Your previous weight entries</p>
          </div>

          <span className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-400">{LogList.length} entries</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {LogList.length > 0 ? (
            LogList.map((item) => <LogHistoryList key={item.id} logItem={item} />)
          ) : (
            <div className="col-span-full rounded-xl border border-dashed border-zinc-800 px-4 py-10 text-center">
              <p className="text-sm font-medium text-zinc-400">No weight entries yet</p>

              <p className="mt-1 text-xs text-zinc-600">Your logged weights will appear here.</p>
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      <div className="mt-4 min-w-0">
        <Pagination currentPage={currentPage} totalPages={totalPage} />
      </div>
    </div>
  );
}
