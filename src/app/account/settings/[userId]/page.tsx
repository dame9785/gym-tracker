import UpdateUserForm from '@/components/forms/user/update-user-form';
import UserService from '@/services/auth-service';
import { GoalTypesService } from '@/services-server/goal-service';
import { notFound } from 'next/navigation';

const goalTypesService = new GoalTypesService();

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserSettings({ params }: PageProps) {
  const { userId } = await params;

  const [userApiResponse, goals] = await Promise.all([
    UserService.getUserById(Number(userId)),
    goalTypesService.getAllGoals(),
  ]);

  const user = userApiResponse.UserSettingsViewModel;
  if (!user || !goals) {
    notFound();
  }

  return (
    <div className="container">
      <div className="form-wrapper flex justify-center items-center m-[5em]">
        <UpdateUserForm user={user} goals={goals} />
      </div>
    </div>
  );
}
