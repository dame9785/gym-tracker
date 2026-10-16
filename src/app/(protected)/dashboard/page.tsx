import DashboardStats from '@/components/dashboard/dashboard-stats';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import WeeklyOverview from '@/components/dashboard/weekly-overview';
import TodayWorkout from '@/components/dashboard/today-workout';
import WeeklySummary from '@/components/dashboard/weekly-summary';
import WorkoutCalendar from '@/components/calendar/workout-calendar';
import { getTokenFromCookieStore, requireAuth } from '@/lib/auth';
import ErrorMessage from '@/components/ui/error-message';
import { DashboardService } from '@/services-server/dashboard-service';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  // Kontrollera att användaren är inloggad
  const user = await requireAuth();
  const userToken = await getTokenFromCookieStore();

  if (!userToken) {
    redirect('/account/login');
  }

  const dashboardService = new DashboardService();

  const response = await dashboardService.getDashboard(user.userId);
  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage
          title="Unable to load foods"
          message={response.message ?? 'Something went wrong while loading your foods.'}
        />
      </main>
    );
  }

  const dashboard = response.data;

  return (
    <div className="w-full space-y-8">
      <DashboardHeader />

      <DashboardStats summary={dashboard.weeklySummary} />

      <WeeklyOverview workouts={dashboard.weeklyOverview} />

      <WorkoutCalendar userToken={userToken} />

      <div className="grid gap-6 lg:grid-cols-2">
        <TodayWorkout workout={dashboard.todayWorkout} />
        <WeeklySummary summary={dashboard.weeklySummary} />
      </div>
    </div>
  );
}
