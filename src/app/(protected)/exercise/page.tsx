import Link from 'next/link';

import Button from '@/components/button/button';
import Exercises from '@/components/exericse/exercises';
import ErrorMessage from '@/components/ui/error-message';
import { ExerciseService } from '@/services-server/exercise-service';
import { requireAuth } from '@/lib/auth';

const exerciseService = new ExerciseService();

export default async function Exercise() {
  const user = await requireAuth();

  const response = await exerciseService.getAllExersise(user.userId);

  if (!response.success || !response.data) {
    return (
      <main className="p-5">
        <ErrorMessage title="Unable to load exercises" message={response.message ?? 'Something went wrong while loading your exercises.'} />
      </main>
    );
  }

  const exercises = response.data;

  return (
    <main className="min-h-screen p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1800px]">
        {/* Page header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Exercises</h1>

            <p className="mt-2 text-sm text-zinc-400 sm:text-base">All exercises are displayed here; you can edit or delete them.</p>
          </div>

          <Link href="/exercise/register" className="inline-flex shrink-0">
            <Button type="button" variant="primary">
              Add exercise
            </Button>
          </Link>
        </div>

        {/* Exercise cards */}
        <Exercises exercises={exercises} />
      </div>
    </main>
  );
}
