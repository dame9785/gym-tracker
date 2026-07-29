'use client';

import { LogItemViewModel } from '@/view-models/log-weight-view-moodel';
import Button from '@/components/button/button';

type PageProps = {
  logItem: LogItemViewModel;
};

export default function LogHistory({ logItem }: PageProps) {
  const handleEdit = () => {};

  return (
    <>
      {/* {editingId === logItem.id && (
        <tr>
          <td colSpan={5} className="bg-zinc-950 px-6 py-4">
            <h1 className="text-xl font-bold text-white">Redigerar viktlogg</h1>
          </td>
        </tr>
      )} */}

      <tr className="border-t border-zinc-800 hover:bg-zinc-800/50">
        <td className="px-6 py-4 text-white">
          {new Date(logItem.logDate ?? '').toLocaleDateString('sv-SE')}
        </td>

        <td className="px-6 py-4 text-white">{logItem.weight} kg</td>

        <td className="px-6 py-4 text-zinc-400">{logItem.note}</td>

        <td className="px-6 py-4">
          <div className="flex gap-4">
            <Button
              type="button"
              text="Redigera"
              variant="secondary"
              size="sm"
              onClick={handleEdit}
            />

            <Button type="button" text="Ta bort" variant="delete" size="sm" />
          </div>
        </td>
      </tr>
    </>
  );
}
