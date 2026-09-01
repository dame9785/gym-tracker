import Link from 'next/link';
import Button from '@/components/button/button';
import WorkoutTable from '@/components/tables/workout-table';
import { WorkoutService } from '@/services-server/workout-service';

import Pagination from '@/components/workout/pagination';
import ErrorMessage from '@/components/ui/error-message';
import { requireAuth } from '@/lib/auth';

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

const workoutService = new WorkoutService();
export default async function Workouts({ searchParams }: Props) {
  //Pagination params
  const params = await searchParams;
  const page = Number(params.page) || 1;

  //Check if user has token or exiperied token.
  const user = await requireAuth();

  const response = await workoutService.getAll(page, user.userId);
  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage title="Unable to load foods" message={response.message ?? 'Something went wrong while loading your foods.'} />
      </main>
    );
  }

  const workouts = response.data.workouts;
  const totalPages = response.data.pagination.totalPages;
  const currentPage = response.data.pagination.currentPage;

  return (
    <div className="container">
      <div className="mb-8 p-5">
        <h1 className="text-4xl font-bold text-white">Workout</h1>
        <p className="mt-2 text-zinc-400">All workout sessions are displayed here; you can edit or delete them.</p>
        <div className="mt-5 flex  gap-5">
          <Link href="/workout/register">
            <Button type="submit" variant="secondary">
              Add workout
            </Button>
          </Link>
          <Link href="/workout-schedule">
            <Button type="submit" variant="primary">
              Schedule a workout
            </Button>
          </Link>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <WorkoutTable workouts={workouts} />
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
