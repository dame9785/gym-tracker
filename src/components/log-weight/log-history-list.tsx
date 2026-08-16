'use client';

//Types
import type { LogItemViewModel } from '@/types/log-weight-types';

//Components
import Button from '@/components/button/button';
import ButtonStyle from '@/components/button/button.module.css';

//Services
import { LogWeightService } from '@/services/log-weight-service';

//Alert toast sooner
import { toast } from 'sonner';

//Routing
import { useRouter } from 'next/navigation';
import Link from 'next/link';

//Props
type PageProps = {
  logItem: LogItemViewModel;
};

export default function LogHistory({ logItem }: PageProps) {
  console.log(logItem);
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
    try {
      const result = await LogWeightService.delete(id);
      if (!result.success) {
        toast.error('Något gick fel');
        return;
      }
      toast.success('Loggen raderades');
      router.refresh();
    } catch (error) {
      toast.error('Något gick fel');
    }
  };

  return (
    <>
      <tr className="border-t border-zinc-800 hover:bg-zinc-800/50">
        <td className="px-6 py-4 text-white">{new Date(logItem.logDate ?? '').toLocaleDateString('sv-SE')}</td>
        <td className="px-6 py-4 text-white">{logItem.weight.toString()} kg</td>
        <td className="px-6 py-4 text-zinc-400">{logItem.note}</td>
        <td className="px-6 py-4">
          <div className="flex gap-4">
            <Link
              className={`${ButtonStyle.primary} ${ButtonStyle.button} ${ButtonStyle.small}`}
              href={`/log-weight/edit/${logItem.id}`}
              type="submit"
            >
              Editera vikt
            </Link>
            <Button type="submit" variant="delete" size="small" onClick={() => handleDelete(logItem.id)}>
              Ta bort vikt
            </Button>
          </div>
        </td>
      </tr>
    </>
  );
}
