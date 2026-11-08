import WorkoutTable from '@/components/workout/workout-detail-card';
import Pagination from '@/components/workout/pagination';
import ErrorMessage from '@/components/ui/error-message';

import { WorkoutService } from '@/services/workout-service';
import { requireAuth } from '@/lib/auth';
import Header from '@/components/ui/header';

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
      <Header
        title="YOUR TRAINING"
        subTitle="Workouts"
        description="Create, manage, and organize your workouts. Build your routines and keep track of your training."
        action={{
          label: 'Create workout',
          href: '/workout/create',
        }}
      />

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
