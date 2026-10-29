import { mapWeeklyOverview } from '@/mapping/dashboard-mapping';

import { DashboardRepository } from '@/repositories/dashboard-repository';
import { WorkoutSessionRepository } from '@/repositories/workout-session-repository';

import type { DashboardResult } from '@/types/api-types';

import { calculateStreak } from '@/utils/calculate-streak';

export class DashboardService {
  private dashboardRepository = new DashboardRepository();
  private workoutSessionRepository = new WorkoutSessionRepository();

  async getDashboard(userId: number): Promise<DashboardResult> {
    const [weeklyOverview, completedWorkoutSessions] = await Promise.all([
      this.dashboardRepository.getWeeklyOverview(userId),
      this.workoutSessionRepository.getCompeletedWorkoutSessiosn(userId),
    ]);

    const weeklyOverviewViewModel = mapWeeklyOverview(weeklyOverview);

    const today = new Date();

    const todayWorkout = weeklyOverviewViewModel.find((workout) => {
      const workoutDate = new Date(workout.date);

      return workoutDate.getFullYear() === today.getFullYear() && workoutDate.getMonth() === today.getMonth() && workoutDate.getDate() === today.getDate();
    });

    const weeklySummary = {
      workouts: weeklyOverviewViewModel.length,
      trainingTime: weeklyOverviewViewModel.reduce((total, workout) => total + workout.estimatedMinutes, 0),
      streak: calculateStreak(completedWorkoutSessions),
    };

    return {
      weeklyOverview: weeklyOverviewViewModel,
      weeklySummary,
      todayWorkout,
    };
  }

  async getWeeklyOverView(userId: number) {
    const weeklyOverviewData = await this.dashboardRepository.getWeeklyOverview(userId);

    return mapWeeklyOverview(weeklyOverviewData);
  }
}
