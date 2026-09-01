import WeightForm from '@/components/forms/log-weight/edit-weight-form';
import ErrorMessage from '@/components/ui/error-message';
import { requireAuth } from '@/lib/auth';
import { WeightLogService } from '@/services-server/weight-log-service';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const weightLogService = new WeightLogService();

export default async function EditWeight({ params }: Props) {
  //Check if user has token or exiperied token.
  const user = await requireAuth();

  const { id } = await params;

  const response = await weightLogService.getById(Number(id), user.userId);
  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage title="Unable to load foods" message={response.message ?? 'Something went wrong while loading your foods.'} />
      </main>
    );
  }

  return <WeightForm logWeight={response.data} />;
}
