//Components
import DashboardStatCard from './dashboard-stat-card';

//Types
import { WeeklySummaryViewModel } from '@/types/dashboard-types';

type Props = {
  summary: WeeklySummaryViewModel;
};

export default function DashboardStats({ summary }: Props) {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <DashboardStatCard icon="💪" value={summary.workouts} title="Workouts" subtitle="This week" />
      <DashboardStatCard icon="🔥" value={`${summary.streak} days`} title="Current Streak" />
      <DashboardStatCard icon="⏱" value={`${summary.trainingTime} min`} title="Training Time" />
    </section>
  );
}
