import UpdateUserForm from '@/components/forms/user/update-user-form';
import UserService from '@/services/auth-service';
import GoalTypesService from '@/services/goal-service';
import { redirect } from 'next/navigation';
import { getTokenFromCookieStore } from '@/lib/auth';
import ErrorMessage from '@/components/ui/error-message';

export default async function UserSettings() {
  const token = await getTokenFromCookieStore();
  if (!token) {
    redirect('/account/login');
  }

  /* Fetch all goal types & Current User*/
  const [goalResponse, userResponse] = await Promise.all([GoalTypesService.getAll(), UserService.getCurrentUser(token)]);
  if (!goalResponse.success || !goalResponse.data || !userResponse.success || !userResponse.data) {
    return (
      <main>
        <ErrorMessage title="Unable to load foods" message={goalResponse.message ?? 'Something went wrong while loading your foods.'} />
      </main>
    );
  }

  const goals = goalResponse.data;
  const user = userResponse.data;

  return (
    <div className="container">
      <div className="form-wrapper m-[5em] flex items-center justify-center">
        <UpdateUserForm user={user} goals={goals} />
      </div>
    </div>
  );
}
