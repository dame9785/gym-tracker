//Mapping
import { mapWeeklyOverview } from '@/mapping/dashboard-mapping';

//Repository
import { DashboardRepository } from '@/repositories/dashboard-repository';

//Types
import type { DashboardResponse } from '@/types/dashboard-types';

//NEXT Redirect
import { redirect } from 'next/navigation';
export class DashboardService {
  private dashboardRepository = new DashboardRepository();

  async getDashboard(): Promise<DashboardResponse> {
    try {
      const weeklyOverview = await this.dashboardRepository.getWeeklyOverview();
      const weeklyOverviewViewModel = mapWeeklyOverview(weeklyOverview);

      const today = new Date();

      const todayWorkout = weeklyOverviewViewModel.find((workout) => {
        const workoutDate = new Date(workout.date);

        return workoutDate.getFullYear() === today.getFullYear() && workoutDate.getMonth() === today.getMonth() && workoutDate.getDate() === today.getDate();
      });

      const weeklySummary = {
        workouts: weeklyOverviewViewModel.length,
        trainingTime: 45,
        streak: 3,
      };

      return {
        success: true,
        dashboard: {
          weeklyOverview: weeklyOverviewViewModel,
          todayWorkout: todayWorkout,
          weeklySummary: weeklySummary,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }
}
