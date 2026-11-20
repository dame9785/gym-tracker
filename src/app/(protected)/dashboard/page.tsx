import DashboardStats from '@/components/dashboard/dashboard-stats';
import WeeklyOverview from '@/components/dashboard/weekly-overview';
import DashboardCalendar from '@/components/dashboard/dashboard-calendar';

import { requireAuth } from '@/lib/auth';
import { DashboardService } from '@/services/dashboard-service';
import Header from '@/components/ui/header';
import ErrorMessage from '@/components/ui/error-message';
import PageContainer from '@/components/layout/page-container';

export default async function DashboardPage() {
  const user = await requireAuth();

  const dashboardService = new DashboardService();
  let result: Awaited<ReturnType<DashboardService['getDashboard']>>;

  try {
    result = await dashboardService.getDashboard(user.userId);
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);

    return <ErrorMessage title="Kunde inte ladda dashboard" message="Vi kunde inte hämta din träningsdata. Försök igen senare." />;
  }

  return (
    <PageContainer>
      {/* Page header */}
      <Header title="Welcome back" subTitle="Dashboard" description="Track your workouts and monitor your progress." />

      {/* Statistics */}
      <DashboardStats summary={result.weeklySummary} />

      {/* Weekly overview */}
      <WeeklyOverview workouts={result.weeklyOverview} />

      {/* Calendar */}
      <DashboardCalendar />
    </PageContainer>
  );
}
