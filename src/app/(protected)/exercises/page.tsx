import Exercises from '@/components/exericses/exercises';

import ErrorMessage from '@/components/ui/error-message';
import Header from '@/components/layout/page-header';
import PageContainer from '@/components/layout/page-container';

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
      <PageContainer>
        <ErrorMessage title="Unable to load exercises" message="We couldn't retrieve your exercises. Please try again later." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header
        title="YOUR EXERCISES"
        subTitle="Exercises"
        description="All exercises are displayed here; you can edit or delete them."
        actions={[
          {
            label: 'Add exercise',
            href: '/exercises/register',
            variant: 'primary',
          },
        ]}
      />

      <Exercises exercises={exercises} />
    </PageContainer>
  );
}
