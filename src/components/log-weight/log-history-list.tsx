'use client';

import { CalendarDays, Pencil, Trash2, Scale } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { LogItemViewModel } from '@/types/log-weight-types';
import { deleteLogWeight } from '@/actions/log-weight-actions';

type PageProps = {
  logItem: LogItemViewModel;
};

export default function LogHistory({ logItem }: PageProps) {
  const router = useRouter();

  const handleDelete = (id: number) => {
    toast('Are you sure you want to delete this weight entry?', {
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
      console.error('Failed to delete weight:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <article className="group min-w-0 rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 transition-all duration-200 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5 sm:p-5">
      {/* Main content */}
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        {/* Date */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 transition-colors group-hover:bg-orange-500/15">
            <CalendarDays className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-200 sm:text-base">{new Date(logItem.logDate ?? '').toLocaleDateString('sv-SE')}</p>
            <p className="mt-0.5 text-xs text-zinc-500">Weight log</p>
          </div>
        </div>

        {/* Weight */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 sm:flex">
            <Scale className="h-4 w-4" />
          </div>

          <span className="text-lg font-bold tabular-nums text-white sm:text-xl">{logItem.weight.toString()} kg</span>
        </div>
      </div>

      {/* Note and actions */}
      <div className="mt-4 flex min-w-0 items-center justify-between gap-3 border-t border-zinc-800/80 pt-3">
        <p className="min-w-0 flex-1 truncate text-xs text-zinc-500 sm:text-sm" title={logItem.note || 'Ingen anteckning'}>
          {logItem.note || 'Ingen anteckning'}
        </p>

        <div className="flex shrink-0 items-center gap-2">
          {/* Edit */}
          <Link
            href={`/log-weight/edit/${logItem.id}`}
            aria-label="Redigera vikt"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/70 text-zinc-400 transition-all duration-200 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
          >
            <Pencil className="h-4 w-4" />
          </Link>

          {/* Delete */}
          <button
            type="button"
            onClick={() => handleDelete(logItem.id)}
            aria-label="Ta bort vikt"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/70 text-zinc-400 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
