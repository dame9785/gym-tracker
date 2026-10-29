import Link from 'next/link';

import Button from '@/components/button/button';
import WorkoutTable from '@/components/tables/workout-table';
import Pagination from '@/components/workout/pagination';
import ErrorMessage from '@/components/ui/error-message';

import { WorkoutService } from '@/services-server/workout-service';
import { requireAuth } from '@/lib/auth';

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

const workoutService = new WorkoutService();

export default async function Workouts({ searchParams }: Props) {
  const params = await searchParams;
  const parsedPage = Number(params.page);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const user = await requireAuth();

  let workoutData: Awaited<ReturnType<typeof workoutService.getAll>> | null = null;

  try {
    workoutData = await workoutService.getAll(page, user.userId);
  } catch (error) {
    console.error('Failed to load workouts:', error);
  }

  if (!workoutData) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorMessage title="Unable to load workouts" message="Something went wrong while loading your workouts." />
      </main>
    );
  }

  const { workouts, pagination } = workoutData;
  const { totalPages, currentPage } = pagination;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header className="mb-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">Training library</p>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Workouts</h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">Manage your training routines, explore your exercises, and keep your workouts organized.</p>
          </div>

          <div className="flex flex-col gap-3 min-[420px]:flex-row sm:shrink-0">
            <Link href="/workout/register">
              <Button type="button" variant="secondary">
                Add workout
              </Button>
            </Link>

            <Link href="/workout-schedule">
              <Button type="button" variant="primary">
                Schedule a workout
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 h-px w-full bg-linear-to-r from-orange-500/40 via-zinc-800 to-transparent" />
      </header>

      <section aria-label="Workout library" className="space-y-5">
        <WorkoutTable workouts={workouts} />
      </section>

      {totalPages > 1 && (
        <nav aria-label="Workout pagination" className="mt-10 flex justify-center border-t border-zinc-800/70 pt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </nav>
      )}
    </main>
  );
}
