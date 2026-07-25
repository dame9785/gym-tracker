import Button from '@/components/button/button';

export default function ExerciseTable() {
  return (
    <table className="w-full border-collapse">
      <thead className="bg-zinc-800">
        <tr>
          <th className="border-b border-zinc-700 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Övning
          </th>
          <th className="border-b border-zinc-700 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Namn
          </th>
          <th className="border-b border-zinc-700 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Muskelgrupp
          </th>
          <th className="border-b border-zinc-700 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Redskap
          </th>
          <th className="border-b border-zinc-700 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Redigera
          </th>
        </tr>
      </thead>

      <tbody>
        <tr className="transition-colors hover:bg-zinc-800">
          <td className="border-b border-zinc-800 px-6 py-4 text-zinc-100">Push Day</td>

          <td className="border-b border-zinc-800 px-6 py-4">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
              Completed
            </span>
          </td>

          <td className="border-b border-zinc-800 px-6 py-4 text-zinc-300">7</td>

          <td className="border-b border-zinc-800 px-6 py-4 text-zinc-300">52 min</td>

          <td className="border-b border-zinc-800 px-6 py-4 text-zinc-300">
            <div className="flex gap-4">
              <Button type="submit" text="Redigera övning" variant="primary" size="sm"></Button>
              <Button type="submit" text="Radera övning" variant="delete" size="sm"></Button>
            </div>
          </td>
        </tr>

        <tr className="bg-zinc-900/50 transition-colors hover:bg-zinc-800">
          <td className="border-b border-zinc-800 px-6 py-4 text-zinc-100">Leg Day</td>

          <td className="border-b border-zinc-800 px-6 py-4">
            <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-400">
              Active
            </span>
          </td>

          <td className="border-b border-zinc-800 px-6 py-4 text-zinc-300">6</td>

          <td className="border-b border-zinc-800 px-6 py-4 text-zinc-300">38 min</td>

          <td className="border-b border-zinc-800 px-6 py-4 text-zinc-300">
            <div className="flex gap-4">
              <Button type="submit" text="Redigera övning" variant="primary" size="sm"></Button>
              <Button type="submit" text="Radera övning" variant="delete" size="sm"></Button>
            </div>
          </td>
        </tr>

        <tr className="transition-colors hover:bg-zinc-800">
          <td className="px-6 py-4 text-zinc-100">Upper Body</td>

          <td className="px-6 py-4">
            <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400">
              Not Completed
            </span>
          </td>
          <td className="px-6 py-4 text-zinc-300">Hej </td>
          <td className="px-6 py-4 text-zinc-300">0 min</td>
          <td className="px-6 py-4 text-zinc-300">
            <div className="flex gap-4">
              <Button type="submit" text="Redigera övning" variant="primary" size="sm"></Button>
              <Button type="submit" text="Radera övning" variant="delete" size="sm"></Button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
