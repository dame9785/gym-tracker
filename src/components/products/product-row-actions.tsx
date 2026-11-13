'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { archiveProductAction, restoreProductAction, deleteProductAction } from '@/actions/product-actions';

type ProductRowActionsProps = {
  id: number;
  name: string;
  archived: boolean;
};

export default function ProductRowActions({ id, name, archived }: ProductRowActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function handleArchiveAction() {
    const message = archived ? `Restore "${name}"?` : `Archive "${name}"?`;

    if (!window.confirm(message)) return;

    setError('');

    startTransition(async () => {
      const result = archived ? await restoreProductAction(id) : await archiveProductAction(id);

      if (!result.success) {
        setError(result.message || 'Something went wrong.');
        return;
      }

      router.refresh();
    });
  }

  function handleDelete() {
    if (!window.confirm(`Permanently delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setError('');

    startTransition(async () => {
      const result = await deleteProductAction(id);

      if (!result.success) {
        setError(result.message || 'Could not delete product.');
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={handleArchiveAction}
          className={`inline-flex h-9 w-24 items-center justify-center rounded-lg border text-xs font-medium transition-colors disabled:opacity-50 ${archived ? 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10' : 'border-amber-500/20 text-amber-400 hover:bg-amber-500/10'}`}
        >
          {isPending ? 'Please wait...' : archived ? 'Restore' : 'Archive'}
        </button>

        {archived && (
          <button type="button" disabled={isPending} onClick={handleDelete} className="inline-flex h-9 w-24 items-center justify-center rounded-lg border border-red-500/20 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50">
            Delete
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="max-w-60 text-right text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
