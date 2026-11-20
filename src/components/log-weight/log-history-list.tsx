'use client';

import { CalendarDays, Pencil, Trash2, Scale } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { LogItemViewModel } from '@/types/log-weight-types';
import { deleteLogWeight } from '@/actions/log-weight-actions';
import Button from '@/components/button/button';
import Card from '@/components/ui/card';

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
    <Card variant="interactive" padding="sm" className="min-w-0">
      {/* Main content */}
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        {/* Date */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-500/10 bg-orange-500/[0.08] text-orange-400 transition-colors group-hover:bg-orange-500/[0.12]">
            <CalendarDays className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-200 sm:text-base">{new Date(logItem.logDate ?? '').toLocaleDateString('sv-SE')}</p>
            <p className="mt-0.5 text-xs text-zinc-500">Weight log</p>
          </div>
        </div>

        {/* Weight */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden h-9 w-9 items-center justify-center rounded-xl border border-blue-500/10 bg-blue-500/[0.08] text-blue-400 sm:flex">
            <Scale className="h-4 w-4" />
          </div>

          <span className="text-lg font-semibold text-zinc-100 tabular-nums sm:text-xl">{logItem.weight.toString()} kg</span>
        </div>
      </div>

      {/* Note and actions */}
      <div className="mt-4 flex min-w-0 items-center justify-between gap-3 border-t border-zinc-800/80 pt-3">
        <p className="min-w-0 flex-1 truncate text-xs text-zinc-500 sm:text-sm" title={logItem.note || 'Ingen anteckning'}>
          {logItem.note || 'Ingen anteckning'}
        </p>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Edit */}
          <Button href={`/log-weight/edit/${logItem.id}`} variant="secondary" size="sm" aria-label="Redigera vikt" className="flex h-9 w-9 items-center justify-center !p-0">
            <Pencil className="h-4 w-4" />
          </Button>

          {/* Delete */}
          <Button type="button" variant="danger" size="sm" onClick={() => handleDelete(logItem.id)} aria-label="Ta bort vikt" className="flex h-9 w-9 items-center justify-center !p-0">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
