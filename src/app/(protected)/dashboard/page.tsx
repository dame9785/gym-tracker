import DashboardStats from '@/components/dashboard/dashboard-stats';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import WeeklyOverview from '@/components/dashboard/weekly-overview';
import TodayWorkout from '@/components/dashboard/today-workout';
import WeeklySummary from '@/components/dashboard/weekly-summary';
import WorkoutCalendar from '@/components/calendar/workout-calendar';

import { requireAuth } from '@/lib/auth';
import { DashboardService } from '@/services/dashboard-service';

export default async function DashboardPage() {
  const user = await requireAuth();

  const dashboardService = new DashboardService();
  const result = await dashboardService.getDashboard(user.userId);
  console.log(result);

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

      {/* Workout and summary */}
      <section className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
        <div className="min-w-0">
          <TodayWorkout workout={result.todayWorkout} />
        </div>

        <div className="min-w-0">
          <WeeklySummary summary={result.weeklySummary} />
        </div>
      </section>
    </div>
  );
}
