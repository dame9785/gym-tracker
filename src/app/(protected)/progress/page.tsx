import ProgressHeader from '@/components/progress/progress-header';
import WeightProgress from '@/components/progress/progress-weight';
import GoalProgress from '@/components/progress/progress-goal';
import ExerciseProgress from '@/components/progress/progress-exercise';

import { requireAuth } from '@/lib/auth';
import ProgressService from '@/services-server/progress-service';
import ErrorMessage from '@/components/ui/error-message';

export default async function ProgressPage() {
  const user = await requireAuth();

  const progressService = new ProgressService();
  const response = await progressService.getProgress(user.userId);

  if (!response.success || !response.data) {
    return (
      <main className="mx-auto max-w-7xl p-8">
        <ErrorMessage title="Kunde inte ladda din träningsprogress" message={response.message ?? 'Något gick fel när dina träningsresultat skulle hämtas.'} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-8">
      <ProgressHeader />

      <WeightProgress weightData={response.data.weightProgress} />

      <GoalProgress weightData={response.data.weightProgress} />

      <ExerciseProgress exerciseProgress={response.data.exerciseProgress} />
    </main>
  );
}
