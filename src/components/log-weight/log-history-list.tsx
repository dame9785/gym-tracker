'use client';

import { CalendarDays, Pencil, Trash2, Scale } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Types
import type { LogItemViewModel } from '@/types/log-weight-types';

// Services
import LogWeightService from '@/services/log-weight-service';

// Props
type PageProps = {
  logItem: LogItemViewModel;
};

export default function LogHistory({ logItem }: PageProps) {
  const router = useRouter();

  const handleDelete = (id: number): void => {
    toast('Är du säker på att du vill radera loggen?', {
      action: {
        label: 'Radera',
        onClick: async () => {
          await removeLogCallAPI(id);
        },
      },
      cancel: {
        label: 'Avbryt',
        onClick: () => {},
      },
    });
  };

  const removeLogCallAPI = async (id: number): Promise<void> => {
    try {
      const result = await LogWeightService.delete(id);

      if (!result.success) {
        toast.error('Något gick fel. Loggen kunde inte raderas.');
        return;
      }

      toast.success('Loggen raderades');
      router.refresh();
    } catch {
      toast.error('Något gick fel. Loggen kunde inte raderas.');
    }
  };

  return (
    <tr className="group border-b border-zinc-800/70 transition-all duration-200 hover:bg-zinc-800/40">
      {/* Date */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              bg-orange-500/10
              text-orange-400
              transition-all duration-200
              group-hover:bg-orange-500/15
            "
          >
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-zinc-200">{new Date(logItem.logDate ?? '').toLocaleDateString('sv-SE')}</p>
            <p className="text-xs text-zinc-600">Weight log</p>
          </div>
        </div>
      </td>

      {/* Weight */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              bg-blue-500/10
              text-blue-400
            "
          >
            <Scale className="h-4 w-4" />
          </div>

          <span className="text-lg font-bold text-white">{logItem.weight.toString()} kg</span>
        </div>
      </td>

      {/* Note */}
      <td className="max-w-md px-6 py-5">
        <p
          className="
            truncate
            text-sm
            text-zinc-400
          "
          title={logItem.note}
        >
          {logItem.note || 'Ingen anteckning'}
        </p>
      </td>

      {/* Actions */}
      <td className="px-6 py-5">
        <div className="flex justify-start gap-2">
          {/* Edit */}
          <Link
            href={`/log-weight/edit/${logItem.id}`}
            aria-label="Redigera vikt"
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              border border-zinc-700
              bg-zinc-800/70
              text-zinc-400
              transition-all duration-200
              hover:border-blue-500/40
              hover:bg-blue-500/10
              hover:text-blue-400
            "
          >
            <Pencil className="h-4 w-4" />
          </Link>

          {/* Delete */}
          <button
            type="button"
            onClick={() => handleDelete(logItem.id)}
            aria-label="Ta bort vikt"
            className="
            cursor-pointer
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              border border-zinc-700
              bg-zinc-800/70
              text-zinc-400
              transition-all duration-200
              hover:border-red-500/40
              hover:bg-red-500/10
              hover:text-red-400
            "
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
