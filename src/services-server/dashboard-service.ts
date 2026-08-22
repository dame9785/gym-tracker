//Mapping
import { mapWeeklyOverview } from '@/mapping/dashboard-mapping';

//Repository
import { DashboardRepository } from '@/repositories/dashboard-repository';
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse, DashboardApiResponse } from '@/types/api-types';

export class DashboardService {
  private dashboardRepository = new DashboardRepository();

  async getDashboard(userId: number): Promise<ApiResponse<DashboardApiResponse>> {
    try {
      const weeklyOverview = await this.dashboardRepository.getWeeklyOverview(userId);
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
        data: {
          weeklyOverview: weeklyOverviewViewModel,
          weeklySummary: weeklySummary,
          todayWorkout: todayWorkout,
        },
      } satisfies ApiSuccessResponse<DashboardApiResponse>;
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: 'Något gick fel.',
      } satisfies ApiErrorResponse;
    }
  }

  async getWeeklyOverView(userId: number) {
    const weeklyOverViewDat = await this.dashboardRepository.getWeeklyOverview(userId);
    const viewModel = mapWeeklyOverview(weeklyOverViewDat);

    return viewModel; // ✅
  }
}
