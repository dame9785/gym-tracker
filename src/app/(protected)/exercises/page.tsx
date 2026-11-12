import Link from 'next/link';

import Button from '@/components/button/button';
import Exercises from '@/components/exericses/exercises';
import ErrorMessage from '@/components/ui/error-message';
import Header from '@/components/ui/header';

import { ExerciseService } from '@/services/exercise-service';
import { requireAuth } from '@/lib/auth';

import type { ExerciseViewModel } from '@/types/exercise-types';

export default async function ExercisePage() {
  const user = await requireAuth();
  const exerciseService = new ExerciseService();

  let exercises: ExerciseViewModel[];

  try {
    exercises = await exerciseService.getAllExersise(user.userId);
  } catch (error: unknown) {
    console.error('Failed to fetch exercises:', error);

    return (
      <main className="p-5">
        <ErrorMessage title="Unable to load exercises" message="We couldn't retrieve your exercises. Please try again later." />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1800px]">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Header title="YOUR EXERCISES" subTitle="Exercises" description="All exercises are displayed here; you can edit or delete them." />

          <Link href="/exercises/register" className="inline-flex shrink-0">
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
