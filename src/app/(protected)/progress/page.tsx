import ExerciseProgress from '@/components/progress/progress-exercise';

import ErrorMessage from '@/components/ui/error-message';
import Header from '@/components/layout/page-header';
import PageContainer from '@/components/layout/page-container';

import { requireAuth } from '@/lib/auth';
import ProgressService from '@/services/progress-service';

export default async function ProgressPage() {
  const user = await requireAuth();

  const progressService = new ProgressService();

  let exerciseProgress: Awaited<ReturnType<typeof progressService.getProgress>>['exerciseProgress'];

  try {
    const response = await progressService.getProgress(user.userId);
    exerciseProgress = response.exerciseProgress;
  } catch (error: unknown) {
    console.error('Failed to load exercise progress:', error);

    return (
      <PageContainer className="!space-y-6 sm:!space-y-8">
        <ErrorMessage title="Unable to load progress" message="We couldn't retrieve your exercise progress. Please try again later." />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="!space-y-6 sm:!space-y-8">
      <Header title="YOUR TRAINING" subTitle="Progress" description="Track your progress. Reach your goals. Keep track of your workouts, monitor your progress, and stay focused on your fitness goals." />

      <section className="min-w-0">
        <div className="border-border mb-4 border-b pb-3 sm:mb-5 sm:pb-4">
          <h2 className="text-text text-base leading-6 font-semibold sm:text-lg">Training and Personal Records</h2>

          <p className="text-text-secondary mt-1 text-sm leading-5 sm:leading-6">Track your exercise progress, compare results, and monitor your personal records over time.</p>
        </div>

        <ExerciseProgress exerciseProgress={exerciseProgress} metric="weight" />
      </section>
    </PageContainer>
  );
}
