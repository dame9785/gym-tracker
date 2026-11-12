import type { WeeklyWorkoutViewModel } from '@/types/workout-types';

export interface ActionError {
  success: false;
  message: string;
}

export interface ActionSuccess {
  success: true;
  message: string;
}

export type CalendarActionResult =
  | {
      success: true;
      data: WeeklyWorkoutViewModel[];
    }
  | ActionError;

export interface RegisterWorkoutScheduleDto {
  workoutId: number;
  date: string;
}
