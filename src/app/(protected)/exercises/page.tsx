import Link from 'next/link';

import Button from '@/components/button/button';
import Exercises from '@/components/exericses/exercises';
import ErrorMessage from '@/components/ui/error-message';
import { ExerciseService } from '@/services-server/exercise-service';
import { requireAuth } from '@/lib/auth';
import type { ExerciseListResult } from '@/types/exercise-types';

const exerciseService = new ExerciseService();

export default async function Exercise(): Promise<React.ReactElement> {
  const user = await requireAuth();

  let exercises: ExerciseListResult;

  try {
    exercises = await exerciseService.getAllExersise(user.userId);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Something went wrong while loading your exercises.';

    return (
      <main className="p-5">
        <ErrorMessage title="Unable to load exercises" message={message} />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1800px]">
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

        <Exercises exercises={exercises} />
      </div>
    </main>
  );
}
