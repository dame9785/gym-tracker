import { WeeklyWorkoutViewModel } from '@/view-models/dashboard-view-model';
import { Prisma } from '@prisma/client';
type WeeklyOverview = Prisma.WorkoutScheduleGetPayload<{
  include: {
    workout: true;
  };
}>;

export function mapWeeklyOverview(workouts: WeeklyOverview[]): WeeklyWorkoutViewModel[] {
  return workouts.map((workout) => ({
    id: workout.id,
    workoutName: workout.workout.name,
    date: workout.date.toISOString(),
  }));
}
