export interface ActionError {
  success: false;
  message: string;
}

export interface ActionSuccess {
  success: true;
  message: string;
}

export interface RegisterWorkoutScheduleDto {
  workoutId: number;
  date: string;
}
