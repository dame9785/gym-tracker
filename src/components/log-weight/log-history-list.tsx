'use client';

//Types
import type { LogItemViewModel } from '@/types/log-weight-types';

//Components
import Button from '@/components/button/button';

//Services
import { LogWeightService } from '@/services/log-weight-service';

//Alert toast sooner
import { toast } from 'sonner';

//Routing
import { useRouter } from 'next/navigation';

//Props
type PageProps = {
  logItem: LogItemViewModel;
};

export default function LogHistory({ logItem }: PageProps) {
  const router = useRouter();

  const handleDelete = async (id: number): Promise<void> => {
    toast('Är du säker på att du vill radera Log?', {
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
    const result = await LogWeightService.delete(id);

    if (!result.success) {
      toast.error('Något gick fel');
      return;
    }

    toast.success('Loggen raderades');
    router.refresh();
  };

  return (
    <>
      <tr className="border-t border-zinc-800 hover:bg-zinc-800/50">
        <td className="px-6 py-4 text-white">{new Date(logItem.logDate ?? '').toLocaleDateString('sv-SE')}</td>

        <td className="px-6 py-4 text-white">{logItem.weight} kg</td>

        <td className="px-6 py-4 text-zinc-400">{logItem.note}</td>

        <td className="px-6 py-4">
          <div className="flex gap-4">
            <Button type="button" text="Redigera" variant="secondary" size="sm" />

            <Button type="button" text="Ta bort" variant="delete" size="sm" onClick={() => handleDelete(logItem.id)} />
          </div>
        </td>
      </tr>
    </>
  );
}
