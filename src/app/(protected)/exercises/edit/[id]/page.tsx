import { notFound } from 'next/navigation';

import EditExerciseForm from '@/components/forms/exercise/edit-exercise-form';

import ErrorMessage from '@/components/ui/error-message';
import Header from '@/components/ui/header';
import PageContainer from '@/components/layout/page-container';

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
      <PageContainer>
        <ErrorMessage title="Unable to load exercise" message="We couldn't retrieve this exercise. Please try again later." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header
        title="YOUR EXERCISES"
        subTitle="Edit exercise"
        description="Update the muscle groups, instructions, equipment and other details for this exercise."
        actions={[
          {
            label: 'Back to exercises',
            href: '/exercises',
            variant: 'secondary',
          },
        ]}
      />

      <EditExerciseForm exericse={exercise} />
    </PageContainer>
  );
}
