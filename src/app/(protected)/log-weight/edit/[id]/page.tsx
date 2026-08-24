import WeightForm from '@/components/forms/log-weight/edit-weight-form';
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
  if (!response.success) {
    throw new Error(response.message);
  }

  return <WeightForm userToken={userToken} logWeight={response.data} />;
}
