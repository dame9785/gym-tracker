import { mapWeeklyOverview } from '@/mapping/dashboard-mapping';

import { DashboardRepository } from '@/repositories/dashboard-repository';
import { HistoryRepository } from '@/repositories/history-repository';

import type { DashboardResult } from '@/types/api-types';

import { calculateStreak } from '@/utils/calculate-streak';

export class DashboardService {
  private dashboardRepository = new DashboardRepository();
  private historyRepository = new HistoryRepository();

  async getDashboard(userId: number): Promise<DashboardResult> {
    const [weeklyOverview, plannedWorkouts, workoutSessions] = await Promise.all([this.dashboardRepository.getWeeklyOverview(userId), this.dashboardRepository.getAllPlannedWorkouts(userId), this.historyRepository.getWorkoutSessionsForStreak(userId)]);
    const weeklyOverviewViewModel = mapWeeklyOverview(weeklyOverview);
    const plannedWorkoutsViewModel = mapWeeklyOverview(plannedWorkouts);

    const today = new Date();

    const todayWorkout = weeklyOverviewViewModel.find((workout) => {
      const workoutDate = new Date(workout.date);

      return workoutDate.getFullYear() === today.getFullYear() && workoutDate.getMonth() === today.getMonth() && workoutDate.getDate() === today.getDate();
    });

    const totalDurationMs = workoutSessions.reduce((total, item) => {
      if (!item.startedAt || !item.finishedAt) {
        return total;
      }

      const duration = item.finishedAt.getTime() - item.startedAt.getTime();

      return total + Math.max(0, duration);
    }, 0);

    const durationMinutes = Math.floor(totalDurationMs / 60000);

    const weeklySummary = {
      workouts: weeklyOverviewViewModel.length,
      plannedWorkouts: plannedWorkouts.length,
      trainingTime: durationMinutes,
      streak: calculateStreak(workoutSessions),
    };

    return {
      weeklyOverview: weeklyOverviewViewModel,
      plannedWorkouts: plannedWorkoutsViewModel,
      weeklySummary,
      todayWorkout,
    };
  }
}
