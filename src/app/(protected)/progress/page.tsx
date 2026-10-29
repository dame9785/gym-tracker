import ProgressHeader from '@/components/progress/progress-header';
import WeightProgress from '@/components/progress/progress-weight';
import GoalProgress from '@/components/progress/progress-goal';
import ExerciseProgress from '@/components/progress/progress-exercise';

import { requireAuth } from '@/lib/auth';
import ProgressService from '@/services-server/progress-service';
import ErrorMessage from '@/components/ui/error-message';

import WeightProgressChart from '@/components/progress/weight-progress-chart';

export default async function ProgressPage() {
  const user = await requireAuth();

  const progressService = new ProgressService();
  const response = await progressService.getProgress(user.userId);

  if (!response.success || !response.data) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorMessage title="Kunde inte ladda din träningsprogress" message={response.message ?? 'Något gick fel när dina träningsresultat skulle hämtas.'} />
      </main>
    );
  }

  const weightProgress = response.data.weightProgress;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10">
        <ProgressHeader />
      </div>

      <section className="mb-12">
        <div className="mb-5 border-b border-zinc-800 pb-4">
          <h2 className="text-lg font-semibold text-white">Vikt och mål</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-400">Följ din viktförändring och se hur du närmar dig ditt mål.</p>
        </div>

        <div className="space-y-5">
          <WeightProgress weightData={weightProgress} />

          <GoalProgress weightData={weightProgress} />

          {weightProgress && <WeightProgressChart history={weightProgress.history} startWeight={weightProgress.startWeight} goalWeight={weightProgress.goalWeight} />}
        </div>
      </section>

      <section>
        <div className="mb-5 border-b border-zinc-800 pb-4">
          <h2 className="text-lg font-semibold text-white">Träning och personliga rekord</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-400">Följ utvecklingen för dina övningar, jämför resultat och se dina rekord över tid.</p>
        </div>

        <ExerciseProgress exerciseProgress={response.data.exerciseProgress} metric="weight" />
      </section>
    </main>
  );
}
