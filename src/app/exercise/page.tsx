import ExerciseTable from '@/components/tables/exercise-table';

export default function Exercise() {
  return (
    <div className="container">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Övningar</h1>
        <p className="mt-2 text-zinc-400">
          Här syns alla övningar, som du kan redigera eller ta bort
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <ExerciseTable />
      </div>
    </div>
  );
}
