import { redirect } from 'next/navigation';

import { DashboardService } from '@/services-server/dashboard-service';
import AuthService from '@/services/auth-service';

import { getTokenFromCookieStore } from '@/lib/auth';

import DashboardStats from '@/components/dashboard/dashboard-stats';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import WeeklyOverview from '@/components/dashboard/weekly-overview';
import TodayWorkout from '@/components/dashboard/today-workout';
import WeeklySummary from '@/components/dashboard/weekly-summary';

export default async function DashboardPage() {
  const token = await getTokenFromCookieStore();

  if (!token) {
    redirect('/account/login');
  }

  const apiResponse = await AuthService.me(token);

  if (!apiResponse.success) {
    redirect('/account/login');
  }

  const dashboardService = new DashboardService();

  const result = await dashboardService.getDashboard();

  if (!result.success || !result.dashboard) {
    return <p>Kunde inte hämta dashboard.</p>;
  }

  const dashboard = result.dashboard;

  return (
    <main className="container space-y-8">
      <DashboardHeader />

      <DashboardStats summary={dashboard.weeklySummary} />

      <WeeklyOverview workouts={dashboard.weeklyOverview} />

      <div className="grid gap-6 lg:grid-cols-2">
        <TodayWorkout workout={dashboard.todayWorkout} />

        <WeeklySummary summary={dashboard.weeklySummary} />
      </div>
    </main>
  );
}
