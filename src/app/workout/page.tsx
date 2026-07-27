import Link from 'next/link';
import Button from '@/components/button/button';
import WorkoutTable from '@/components/tables/workout-table';
export default function Workouts() {
  return (
    <div className="container">
      <div className="mb-8 p-5">
        <h1 className="text-4xl font-bold text-white">Träningspass</h1>
        <p className="mt-2 text-zinc-400">
          Här syns alla träningspass, som du kan redigera eller ta bort
        </p>
        <div className="mt-5">
          <Link href="/workout/register">
            <Button type="button" text="Lägg till träningspass" variant="secondary" />
          </Link>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <WorkoutTable />
      </div>
    </div>
  );
}
