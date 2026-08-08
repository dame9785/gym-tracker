import UpdateUserForm from '@/components/forms/user/update-user-form';
import UserService from '@/services/auth-service';
import GoalService from '@/services/goal-service';

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserSettings({ params }: PageProps) {
  const { userId } = await params;

  const [user, goals] = await Promise.all([
    UserService.getUserById(Number(userId)),
    GoalService.getAll(),
  ]);

  if (!user) {
    // Detta tar vi senare
    return <div>Användaren kunde inte hittas.</div>;
  }

  return (
    <div className="container">
      <div className="form-wrapper flex justify-center items-center m-[5em]">
        <UpdateUserForm
          user={user}
          goals={goals}
        />
      </div>
    </div>
  );
}