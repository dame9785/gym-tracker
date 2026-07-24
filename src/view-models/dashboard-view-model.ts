import { WorkoutSessionStatus } from '@prisma/client';
export interface WorkoutExerciseViewModel {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight?: number | null;
  order: number;
}

export interface WeeklyWorkoutViewModel {
  id: number;
  workoutName: string;
  date: string;
  exerciseCount: number;
  estimatedMinutes: number;
  status: WorkoutSessionStatus;
  activeSessionId: number | null;
  exercises: WorkoutExerciseViewModel[];
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
