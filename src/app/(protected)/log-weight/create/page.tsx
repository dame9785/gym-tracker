//Components
import LogWeightForm from '@/components/forms/log-weight/log-weight-form';
import { getTokenFromCookieStore } from '@/lib/auth';
import AuthService from '@/services/auth-service';
import { UserViewModel } from '@/types/user-types';
import { redirect } from 'next/navigation';

export default async function create() {
  const userToken = await getTokenFromCookieStore();

  if (!userToken) {
    redirect('/account/login');
  }

  return (
    <div className="container">
      <div className="form-wrapper flex justify-center items-center m-[5em]">
        <LogWeightForm userToken={userToken} />
      </div>
    </div>
  );
}
