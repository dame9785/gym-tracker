import WorkoutSession from '@/components/workout/workout-session';
import { WorkoutSessionService } from '@/services-server/workout-session-service';
import { WorkoutSessionViewModel } from '@/view-models/workout-session-view-model';

const workoutSessionService = new WorkoutSessionService();

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkoutSessionPage({ params }: PageProps) {
  const { id } = await params;
  const result = await workoutSessionService.getById(Number(id));

  if (!result.success) {
    return (
      <div className="container">
        <h1 className="text-3xl font-bold text-red-500">Workout session hittades inte</h1>
      </div>
    );
  }

  const workoutSession = result.workoutSession!;
  console.log(JSON.stringify(workoutSession, null, 2));
  return <WorkoutSession workoutSession={workoutSession} />;
}
