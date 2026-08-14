//Components
import LogWeightForm from '@/components/forms/log-weight/log-weight-form';
import { getTokenFromCookieStore } from '@/lib/auth';
import AuthService from '@/services/auth-service';
import { UserViewModel } from '@/types/user-types';
import { redirect } from 'next/navigation';

export default async function create() {
  const token = await getTokenFromCookieStore();

  if (!token) {
    redirect('/account/login');
  }

  const response = await AuthService.getCurrentUser(token);
  if (!response.success || response.data == null) {
    redirect('/account/login');
  }

  const user: UserViewModel = response.data.user;

  return (
    <div className="container">
      <div className="form-wrapper flex justify-center items-center m-[5em]">
        <LogWeightForm user={user} />
      </div>
    </div>
  );
}
