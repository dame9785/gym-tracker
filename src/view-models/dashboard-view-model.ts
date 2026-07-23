export interface WeeklyWorkoutViewModel {
  id: number;
  workoutName: string;
  date: string;
}

export interface WeeklySummaryViewModel {
  workouts: number;
  trainingTime: number;
  streak: number;
}

export interface DashboardViewModel {
  weeklyOverview: WeeklyWorkoutViewModel[];

  todayWorkout?: WeeklyWorkoutViewModel;

  weeklySummary: WeeklySummaryViewModel;
}
