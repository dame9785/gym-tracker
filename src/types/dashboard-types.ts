//Types
import type { WeeklyWorkoutViewModel } from '@/types/workout-types';

//--------View-Model-----------//
export interface DashboardViewModel {
  weeklyOverview: WeeklyWorkoutViewModel[];
  todayWorkout?: WeeklyWorkoutViewModel;
  weeklySummary: WeeklySummaryViewModel;
}

export interface WeeklySummaryViewModel {
  workouts: number;
  trainingTime: number;
  streak: number;
}

//--------Responses-----------//
export type DashboardResponse =
  | {
      success: true;
      dashboard: DashboardViewModel;
    }
  | {
      success: false;
      message: string;
    };
