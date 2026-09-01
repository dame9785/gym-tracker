'use client';

import { CalendarDays, Pencil, Trash2, Scale } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Types
import type { LogItemViewModel } from '@/types/log-weight-types';

import { deleteLogWeight } from '@/actions/log-weight-actions';

// Props
type PageProps = {
  logItem: LogItemViewModel;
};

export default function LogHistory({ logItem }: PageProps) {
  const router = useRouter();

  // Handle delete
  const handleDelete = (id: number) => {
    verifyDelete(id);
  };

  // Verify delete
  const verifyDelete = (id: number): void => {
    toast('Are you sure you want to delete the exercise?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          await removeLogWeight(id);
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  // Remove Log weight
  const removeLogWeight = async (id: number) => {
    try {
      const response = await deleteLogWeight(id);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete Weight:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <tr className="group border-b border-zinc-800/70 transition-all duration-200 hover:bg-zinc-800/40">
      {/* Date */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 transition-all duration-200   group-hover:bg-orange-500/15">
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
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <Scale className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold text-white">{logItem.weight.toString()} kg</span>
        </div>
      </td>

      {/* Note */}
      <td className="max-w-md px-6 py-5">
        <p className="truncate text-sm text-zinc-400" title={logItem.note}>
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
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/70text-zinc-400transition-all duration-200 hover:border-blue-500/40hover:bg-blue-500/10hover:text-blue-400"
          >
            <Pencil className="h-4 w-4" />
          </Link>

          {/* Delete */}
          <button
            type="button"
            onClick={() => handleDelete(logItem.id)}
            aria-label="Ta bort vikt"
            className=" cursor-pointer flex h-9 w-9 items-center justify-center  rounded-lg border border-zinc-700 bg-zinc-800/70 text-zinc-400 transition-all duration-20 hover:border-red-500/40  hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
