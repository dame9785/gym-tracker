import WorkoutSession from '@/components/workout/workout-session';
import { WorkoutSessionService } from '@/services-server/workout-session-service';

const workoutSessionService = new WorkoutSessionService();

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkoutSessionPage({ params }: PageProps) {
  const { id } = await params;
  console.log(id);
  const result = await workoutSessionService.getById(Number(id));

  if (!result.success) {
    return (
      <div className="container">
        <h1 className="text-3xl font-bold text-red-500">Workout session hittades inte</h1>
      </div>
    );
  }

  const workoutSession = result.workoutSession!;

  return <WorkoutSession workoutSession={workoutSession} />;
}
