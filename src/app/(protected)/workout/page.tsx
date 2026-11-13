import WorkoutTable from '@/components/workout/workout-detail-card';
import Pagination from '@/components/ui/pagination';
import ErrorMessage from '@/components/ui/error-message';
import Header from '@/components/ui/header';

import { WorkoutService } from '@/services/workout-service';
import { requireAuth } from '@/lib/auth';

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function Workouts({ searchParams }: Props) {
  const params = await searchParams;
  const parsedPage = Number(params.page);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const user = await requireAuth();
  const workoutService = new WorkoutService();

  let workoutData: Awaited<ReturnType<typeof workoutService.getAll>>;

  try {
    workoutData = await workoutService.getAll(page, user.userId);
  } catch (error: unknown) {
    console.error('Failed to load workouts:', error);

    return <ErrorMessage title="Kunde inte hämta träningspass" message="Det gick inte att ladda dina träningspass. Försök igen senare." />;
  }

  const { workouts, pagination } = workoutData;
  const { totalPages } = pagination;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Header
        title="YOUR TRAINING"
        subTitle="Workouts"
        description="Create, manage, and organize your workouts. Build your routines and keep track of your training."
        actions={[
          {
            label: 'Schedule workout',
            href: '/workout-schedule',
            variant: 'secondary',
          },
          {
            label: 'Create workout',
            href: '/workout/register',
            variant: 'primary',
          },
        ]}
      />

      <section aria-label="Workout library" className="space-y-5">
        <WorkoutTable workouts={workouts} />
      </section>

      {totalPages > 1 && (
        <nav aria-label="Workout pagination" className="mt-10 flex justify-center border-t border-zinc-800/70 pt-6">
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} basePath="/workout" ariaLabel="Workout pagination" />
        </nav>
      )}
    </main>
  );
}
