import WeightForm from '@/components/forms/log-weight/edit-weight-form';
import ErrorMessage from '@/components/ui/error-message';
import { getTokenFromCookieStore } from '@/lib/auth';
import LogWeightService from '@/services/log-weight-service';
import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditWeight({ params }: Props) {
  const { id } = await params;

  const userToken = await getTokenFromCookieStore();
  if (!userToken) {
    redirect('/account/login');
  }
  const response = await LogWeightService.getById(id, userToken);
  if (!response.success || !response.data) {
    return (
      <main>
        <ErrorMessage title="Unable to load foods" message={response.message ?? 'Something went wrong while loading your foods.'} />
      </main>
    );
  }

  return <WeightForm userToken={userToken} logWeight={response.data} />;
}
