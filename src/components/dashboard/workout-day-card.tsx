import { WeeklyWorkoutViewModel } from '@/view-models/dashboard-view-model';

interface WorkoutDayCardProps {
  day: string;
  workout?: WeeklyWorkoutViewModel;
  onClick?: () => void;
}

export default function WorkoutDayCard({ day, workout, onClick }: WorkoutDayCardProps) {
  const hasWorkout = !!workout;

  let borderColor = '';
  if (workout) {
    console.log('Workout', workout);
    if (workout.status === 'COMPLETED') {
      borderColor = 'border-green-500';
    } else if (workout.status === 'ACTIVE') {
      borderColor = 'border-orange-500';
    } else if (workout.status === 'NOTCOMPLETED') {
      borderColor = 'border-red-500';
    }
  } else {
    borderColor = 'border-yellow-500';
  }

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer roun= () =>{}d-xl border p-4 transition-all bg-zinc-900 duration-200 hover:scale-[1.02] ${borderColor}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-400">{day}</p>

        {workout?.status == 'COMPLETED' && (
          <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-semibold text-green-400">
            ✓ Done
          </span>
        )}
      </div>

      <div className="mt-6">
        {hasWorkout ? (
          <>
            <span className="text-3xl">🏋️</span>

            <h3 className="mt-3 text-lg font-bold text-white">{workout?.workoutName}</h3>

            <div className="mt-3 space-y-1 text-sm text-zinc-400">
              <p>📋 {workout?.exerciseCount} exercises</p>
              <p>⏱️ {workout?.estimatedMinutes} min</p>
            </div>
          </>
        ) : (
          <>
            <span className="text-3xl">😴</span>

            <h3 className="mt-3 text-lg font-bold text-zinc-500">Rest Day</h3>

            <p className="mt-3 text-sm text-zinc-600">No workout planned</p>
          </>
        )}
      </div>
    </div>
  );
}
