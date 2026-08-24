//Next Link
import Link from 'next/link';

//Components
import Button from '@/components/button/button';
import ExerciseTable from '@/components/tables/exercise-table';
import ExerciseService from '@/services/exercise-service';
import { redirect } from 'next/navigation';
import { getTokenFromCookieStore } from '@/lib/auth';

export default async function Exercise() {
  const userToken = await getTokenFromCookieStore();

  if (!userToken) {
    redirect('/account/login');
  }

  const response = await ExerciseService.getAll(userToken);
  if (!response.success) {
    throw new Error('Something went wrong');
  }

  const exercises = response.data;

  return (
    <div className="container">
      <div className="mb-8 p-5">
        <h1 className="text-4xl font-bold text-white">Exericses</h1>
        <p className="mt-2 text-zinc-400">All exercises are displayed here; you can edit or delete them.</p>
        <div className="mt-5">
          <Link href="/exercise/register">
            <Button type="submit" variant="primary">
              Add exercise
            </Button>
          </Link>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <ExerciseTable exercises={exercises} userToken={userToken} />
      </div>
    </div>
  );
}
