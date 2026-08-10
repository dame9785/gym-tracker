import UpdateUserForm from '@/components/forms/user/update-user-form';
import UserService from '@/services/auth-service';
import GoalTypesService from '@/services/goal-types-service';
import { notFound } from 'next/navigation';
import { getTokenFromCookieStore } from '@/lib/auth';

export default async function UserSettings() {
  const token = await getTokenFromCookieStore();
  if (!token) {
    notFound();
  }

  /* Fetch all goal types */
  const goalResponse = await GoalTypesService.getAll();
  const userResponse = await UserService.getCurrentUser(token);

  if (!goalResponse.success) {
    notFound();
  }

  if (!userResponse.success) {
    notFound();
  }

  const goals = goalResponse.data.goals;
  const user = userResponse.data.user;

  return (
    <div className="container">
      <div className="form-wrapper m-[5em] flex items-center justify-center">
        <UpdateUserForm user={user} goals={goals} />
      </div>
    </div>
  );
}
