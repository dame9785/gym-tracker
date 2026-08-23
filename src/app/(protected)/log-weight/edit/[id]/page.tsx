import WeightForm from '@/components/forms/log-weight/edit-weight-form';
import { getTokenFromCookieStore } from '@/lib/auth';
import AuthService from '@/services/auth-service';
import LogWeightService from '@/services/log-weight-service';
import { UserViewModel } from '@/types/user-types';
import { notFound, redirect } from 'next/navigation';
import { promise } from 'zod';

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
  const [userResponse, weightResponse] = await Promise.all([AuthService.getCurrentUser(token), LogWeightService.getById(id)]);
  if (!userResponse.success || !weightResponse.success) {
    throw new Error('Something went wrong');
  }

  const user: UserViewModel = userResponse.data;
  return <WeightForm user={user} logWeight={weightResponse.data} />;
}
