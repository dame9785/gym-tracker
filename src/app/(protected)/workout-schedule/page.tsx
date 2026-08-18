import ScheduleWorkoutForm from '@/components/forms/workout/schedule-workout-form';
import WorkoutService from '@/services/workout-service';
import { notFound } from 'next/navigation';

export default async function WorkoutSchedulePage() {
  const response = await WorkoutService.getAll();
  if (!response.success) {
    notFound();
  }

  const workouts = response.data.workouts;

  return (
    <div className="container">
      <h1>Planera träningspass</h1>
      <ScheduleWorkoutForm workouts={workouts} />
    </div>
  );
}
