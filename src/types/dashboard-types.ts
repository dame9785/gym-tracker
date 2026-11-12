import type { WeeklyWorkoutViewModel } from './workout-types';

export interface WeeklySummaryViewModel {
  plannedWorkouts: number;
  completedWorkouts: number;
  streak: number;
}

export interface DashboardResult {
  weeklyOverview: WeeklyWorkoutViewModel[];
  plannedWorkouts: WeeklyWorkoutViewModel[];
  todayWorkout?: WeeklyWorkoutViewModel;
  weeklySummary: WeeklySummaryViewModel;
}
