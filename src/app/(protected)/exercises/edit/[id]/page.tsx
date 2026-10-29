import { notFound } from 'next/navigation';

import EditExerciseForm from '@/components/forms/exercise/edit-exercise-form';
import ErrorMessage from '@/components/ui/error-message';
import { requireAuth } from '@/lib/auth';
import { ExerciseService } from '@/services-server/exercise-service';
import type { ExerciseResult } from '@/types/exercise-types';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const exerciseService = new ExerciseService();

export default async function EditExercises({ params }: PageProps): Promise<React.ReactElement> {
  const user = await requireAuth();
  const { id } = await params;

  const exerciseId = Number(id);

  if (!Number.isSafeInteger(exerciseId) || exerciseId <= 0) {
    notFound();
  }

  let exercise: ExerciseResult;

  try {
    exercise = await exerciseService.getById(exerciseId, user.userId);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Something went wrong while loading this exercise.';

    if (message === 'Exercise not found.' || message === 'Could not find exercise.' || message.toLowerCase().includes('not found')) {
      notFound();
    }

    return (
      <main>
        <ErrorMessage title="Unable to load exercise" message={message} />
      </main>
    );
  }

  return (
    <div className="container">
      <div className="form-wrapper m-[5em] flex items-center justify-center">
        <EditExerciseForm exericse={exercise} />
      </div>
    </div>
  );
}
