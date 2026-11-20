'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/button/button';

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
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isPending}
          onClick={handleArchiveAction}
          className={`!h-9 !w-24 !rounded-lg !border !text-xs !font-medium !transition-colors ${archived ? '!border-success/20 !text-success hover:!bg-success/10' : '!border-warning/20 !text-warning hover:!bg-warning/10'}`}
        >
          {isPending ? 'Please wait...' : archived ? 'Restore' : 'Archive'}
        </Button>

        {archived && (
          <Button type="button" variant="danger" size="sm" disabled={isPending} onClick={handleDelete} className="!border-danger/20 hover:!bg-danger/10 !h-9 !w-24 !rounded-lg !border !text-xs !font-medium !transition-colors">
            Delete
          </Button>
        )}
      </div>

      {error && (
        <p role="alert" className="text-danger max-w-60 text-right text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
