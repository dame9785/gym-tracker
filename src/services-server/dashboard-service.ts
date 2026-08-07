//Mapping
import { mapWeeklyOverview } from '@/mapping/dashboard-mapping';

//Repository
import { DashboardRepository } from '@/repositories/dashboard-repository';

//Types
import type { DashboardResponse } from '@/types/dashboard-types';

export class DashboardService {
  private dashboardRepository = new DashboardRepository();

  async getDashboard(): Promise<DashboardResponse> {
    try {
      const weeklyOverviewViewModel = await this.getWeeklyOverView();
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
          todayWorkout,
          weeklySummary,
        },
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: 'Något gick fel.',
      };
    }
  }

  async getWeeklyOverView() {
    const weeklyOverViewDat = await this.dashboardRepository.getWeeklyOverview();
    const viewModel = mapWeeklyOverview(weeklyOverViewDat);

    return viewModel; // ✅
  }
}
