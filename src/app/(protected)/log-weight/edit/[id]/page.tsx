import WeightForm from '@/components/forms/log-weight/edit-weight-form';
import { getTokenFromCookieStore } from '@/lib/auth';
import AuthService from '@/services/auth-service';
import { LogWeightService } from '@/services/log-weight-service';
import { UserViewModel } from '@/types/user-types';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditWeight({ params }: Props) {
  const { id } = await params;

  const token = await getTokenFromCookieStore();

  if (!token) {
    redirect('/account/login');
  }

  const response = await AuthService.getCurrentUser(token);
  if (!response.success || response.data == null) {
    redirect('/account/login');
  }

  const weightResponse = await LogWeightService.getById(id);
  if (!weightResponse.success) {
    notFound();
  }

  const user: UserViewModel = response.data.user;
  return <WeightForm user={user} logWeight={weightResponse.data.log} />;
}
