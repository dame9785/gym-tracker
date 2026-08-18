import { DashboardService } from '@/services-server/dashboard-service';
import DashboardStats from '@/components/dashboard/dashboard-stats';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import WeeklyOverview from '@/components/dashboard/weekly-overview';
import TodayWorkout from '@/components/dashboard/today-workout';
import WeeklySummary from '@/components/dashboard/weekly-summary';
import WorkoutCalendar from '@/components/calendar/workout-calendar';
import { getTokenFromCookieStore } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const dashboardService = new DashboardService();
  const result = await dashboardService.getDashboard();

  if (!result.success) {
    return <p>Kunde inte hämta dashboard.</p>;
  }

  const token = await getTokenFromCookieStore();
  if (!token) {
    redirect('/account/login');
  }

  const dashboard = result.data;

  return (
    <main className="container space-y-8">
      <DashboardHeader />
      <DashboardStats summary={dashboard.weeklySummary} />
      <WeeklyOverview workouts={dashboard.weeklyOverview} userToken={token} />
      <WorkoutCalendar userId={1} />
      <div className="grid gap-6 lg:grid-cols-2">
        <TodayWorkout workout={dashboard.todayWorkout} />
        <WeeklySummary summary={dashboard.weeklySummary} />
      </div>
    </main>
  );
}
