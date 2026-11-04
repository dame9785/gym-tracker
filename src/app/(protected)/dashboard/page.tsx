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

  return (
    <div className="w-full space-y-8">
      <DashboardHeader />

      <DashboardStats summary={result.weeklySummary} />

      <WeeklyOverview workouts={result.weeklyOverview} />

      <WorkoutCalendar />

      <div className="grid gap-6 lg:grid-cols-2">
        <TodayWorkout workout={result.todayWorkout} />
        <WeeklySummary summary={result.weeklySummary} />
      </div>
    </div>
  );
}
