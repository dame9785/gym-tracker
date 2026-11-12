import { notFound } from 'next/navigation';

import EditExerciseForm from '@/components/forms/exercise/edit-exercise-form';
import ErrorMessage from '@/components/ui/error-message';

import { requireAuth } from '@/lib/auth';
import { ExerciseService } from '@/services/exercise-service';

import type { ExerciseViewModel } from '@/types/exercise-types';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditExercises({ params }: PageProps) {
  const user = await requireAuth();
  const { id } = await params;

  const exerciseId = Number(id);

  if (!Number.isSafeInteger(exerciseId) || exerciseId <= 0) {
    notFound();
  }

  const exerciseService = new ExerciseService();

  let exercise: ExerciseViewModel;

  try {
    exercise = await exerciseService.getById(exerciseId, user.userId);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Something went wrong while loading this exercise.';

    if (message === 'Exercise not found.' || message === 'Could not find exercise.') {
      notFound();
    }

    console.error('Failed to load exercise for editing:', error);

    return (
      <main className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
        <ErrorMessage title="Unable to load exercise" message="We couldn't retrieve this exercise. Please try again later." />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-center">
        <EditExerciseForm exericse={exercise} />
      </div>
    </main>
  );
}
