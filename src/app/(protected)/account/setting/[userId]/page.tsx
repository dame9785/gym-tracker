import UpdateUserForm from '@/components/forms/user/update-user-form';
import UserService from '@/services/auth-service';
import { GoalTypesService } from '@/services-server/goal-service';
import { notFound } from 'next/navigation';

//Services
const goalTypesService = new GoalTypesService();

{
  /* Page Props */
}
interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserSettings({ params }: PageProps) {
  const { userId } = await params;

  const [userResult, goals] = await Promise.all([
    UserService.getUserById(Number(userId)),
    goalTypesService.getAllGoals(),
  ]);

  if (!userResult.success) {
    console.error(userResult.message);

    notFound();
  }

  return (
    <div className="container">
      <div className="form-wrapper m-[5em] flex items-center justify-center">
        <UpdateUserForm user={userResult.data} goals={goals} />
      </div>
    </div>
  );
}
