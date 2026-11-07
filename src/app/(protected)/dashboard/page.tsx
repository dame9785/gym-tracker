import DashboardStats from '@/components/dashboard/dashboard-stats';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import WeeklyOverview from '@/components/dashboard/weekly-overview';
import WorkoutCalendar from '@/components/calendar/workout-calendar';

import { requireAuth } from '@/lib/auth';
import { DashboardService } from '@/services/dashboard-service';

export default async function DashboardPage() {
  const user = await requireAuth();

  const dashboardService = new DashboardService();
  const result = await dashboardService.getDashboard(user.userId);

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-8">
      {/* Header */}
      <section className="min-w-0">
        <DashboardHeader />
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
        <WorkoutCalendar />
      </section>
    </div>
  );
}
