import WeeklyOverview from '@/components/dashboard/weekly-overview';
import TodayWorkout from '@/components/dashboard/today-workout';
import WeeklySummary from '@/components/dashboard/weekly-summary';
import { DashboardService } from '@/services-server/dashboard-service';

const dashboardService = new DashboardService();

export default async function DashboardPage() {
  const result = await dashboardService.getDashboard();
  if (!result.success || !result.dashboard) {
    return <p>Could not load dashboard.</p>;
  }

  const dashboard = result.dashboard;

  return (
    <main className="container space-y-8">
      <h1 className="text-4xl font-bold">Dashboard</h1>

      <WeeklyOverview workouts={dashboard.weeklyOverview} />

      <div className="grid gap-6 lg:grid-cols-2">
        <TodayWorkout workout={dashboard.todayWorkout} />

        <WeeklySummary summary={dashboard.weeklySummary} />
      </div>
    </main>
  );
}
