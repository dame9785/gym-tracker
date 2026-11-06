import DashboardStatCard from '@/components/dashboard/dashboard-stat-card';
import { WeeklySummaryViewModel } from '@/types/dashboard-types';

type Props = {
  summary: WeeklySummaryViewModel;
};

export default function DashboardStats({ summary }: Props) {
  return (
    <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
      <DashboardStatCard icon="💪" value={summary.workouts} title="Workouts" subtitle="This week" />

      <DashboardStatCard icon="🔥" value={`${summary.streak} days`} title="Current Streak" />

      <DashboardStatCard icon="⏱" value={`${summary.trainingTime} min`} title="Training Time" />
    </section>
  );
}
