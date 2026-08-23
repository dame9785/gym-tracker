import DashboardService from '@/services/dashboard-service';
import DashboardStats from '@/components/dashboard/dashboard-stats';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import WeeklyOverview from '@/components/dashboard/weekly-overview';
import TodayWorkout from '@/components/dashboard/today-workout';
import WeeklySummary from '@/components/dashboard/weekly-summary';
import WorkoutCalendar from '@/components/calendar/workout-calendar';
import { getTokenFromCookieStore } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const userToken = await getTokenFromCookieStore();

  if (!userToken) {
    redirect('/account/login');
  }

  const result = await DashboardService.getDashboard(userToken);
  console.log(result);
  if (!result.success) {
    throw new Error('Something went wrong');
  }

  const dashboard = result.data;

  return (
    <main className="container space-y-8">
      <DashboardHeader />
      <DashboardStats summary={dashboard.weeklySummary} />
      <WeeklyOverview workouts={dashboard.weeklyOverview} userToken={userToken} />
      <WorkoutCalendar userToken={userToken} />
      <div className="grid gap-6 lg:grid-cols-2">
        <TodayWorkout workout={dashboard.todayWorkout} />
        <WeeklySummary summary={dashboard.weeklySummary} />
      </div>
    </main>
  );
}
