import Link from 'next/link';
import Button from '@/components/button/button';
import WorkoutTable from '@/components/tables/workout-table';
import WorkoutService from '@/services/workout-service';
import { getTokenFromCookieStore } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import Pagination from '@/components/workout/pagination';

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function Workouts({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const userToken = await getTokenFromCookieStore();

  if (!userToken) {
    redirect('/account/login');
  }

  const response = await WorkoutService.getAll(userToken, page);
  if (!response.success) {
    notFound();
  }
  const workouts = response.data.workouts;
  const totalPages = response.data.pagination.totalPages;
  const currentPage = response.data.pagination.currentPage;

  return (
    <div className="container">
      <div className="mb-8 p-5">
        <h1 className="text-4xl font-bold text-white">Träningspass</h1>
        <p className="mt-2 text-zinc-400">Här syns alla träningspass, som du kan redigera eller ta bort</p>
        <div className="mt-5 flex  gap-5">
          <Link href="/workout/register">
            <Button type="submit" variant="secondary">
              Lägg till träningspass
            </Button>
          </Link>
          <Link href="/workout-schedule">
            <Button type="submit" variant="primary">
              Shema lägg träningspass
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
