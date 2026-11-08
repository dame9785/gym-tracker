import DashboardStats from '@/components/dashboard/dashboard-stats';
import WeeklyOverview from '@/components/dashboard/weekly-overview';
import DashboardCalendar from '@/components/dashboard/dashboard-calendar';

import { requireAuth } from '@/lib/auth';
import { DashboardService } from '@/services/dashboard-service';
import Header from '@/components/ui/header';

export default async function DashboardPage() {
  const user = await requireAuth();

  const dashboardService = new DashboardService();
  const result = await dashboardService.getDashboard(user.userId);

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-8">
      {/* Header */}
      <section className="min-w-0">
        <Header title="YOUR TRAINING" subTitle="Dashboard" description="Track your progress. Reach your goals. Keep track of your workouts, monitor your progress, and stay focused on your fitness goals." />
      </section>

      {/* Statistics */}
      <section className="min-w-0">
        <DashboardStats summary={result.weeklySummary} />
      </section>

      {/* Weekly overview */}
      <section className="min-w-0">
        <WeeklyOverview workouts={result.weeklyOverview} />
      </section>

      {/* Calendar */}
      <section className="min-w-0">
        <DashboardCalendar />
      </section>
    </div>
  );
}
