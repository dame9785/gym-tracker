//Next Link
import Link from 'next/link';

//Components
import Button from '@/components/button/button';
import ExerciseTable from '@/components/tables/exercise-table';
import { ExerciseService } from '@/services-server/exercise-service';

import { requireAuth } from '@/lib/auth';
import ErrorMessage from '@/components/ui/error-message';

const exerciseService = new ExerciseService();
export default async function Exercise() {
  //Check if user has token or exiperied token.
  const user = await requireAuth();

  const response = await exerciseService.getAllExersise(user.userId);

  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage title="Unable to load foods" message={response.message ?? 'Something went wrong while loading your foods.'} />
      </main>
    );
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
        <ExerciseTable exercises={exercises} />
      </div>
    </div>
  );
}
