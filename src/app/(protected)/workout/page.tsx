import Link from 'next/link';
import Button from '@/components/button/button';
import WorkoutTable from '@/components/tables/workout-table';
import WorkoutService from '@/services/workout-service';

export default async function Workouts() {
  const response = await WorkoutService.getAll();
  console.log(response);
  const workouts = response.success ? response.data.workouts : [];

  return (
    <div className="container">
      <div className="mb-8 p-5">
        <h1 className="text-4xl font-bold text-white">Träningspass</h1>
        <p className="mt-2 text-zinc-400">Här syns alla träningspass, som du kan redigera eller ta bort</p>
        <div className="mt-5 flex  gap-5">
          <Link href="/workout/register">
            <Button type="submit" variant="secondary">
              Lägg till träningspass
            </Button>
          </Link>
          <Link href="/workout-schedule">
            <Button type="submit" variant="primary">
              Shema lägg träningspass
            </Button>
          </Link>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <WorkoutTable workouts={workouts} />
      </div>
    </div>
  );
}
