import UpdateUserForm from '@/components/forms/user/update-user-form';
import { AuthService } from '@/services-server/auth-service';
import { GoalTypesService } from '@/services-server/goal-service';
import ErrorMessage from '@/components/ui/error-message';
import { requireAuth } from '@/lib/auth';

const goalTypeService = new GoalTypesService();
const authService = new AuthService();

export default async function UserSettings() {
  // Kontrollera att användaren är inloggad
  const user = await requireAuth();

  /* Fetch all goal types & Current User*/
  const [goalResponse, userResponse] = await Promise.all([
    goalTypeService.getAllGoals(),
    authService.getUserById(user.userId),
  ]);

  if (!goalResponse.success || !goalResponse.data || !userResponse.success || !userResponse.data) {
    return (
      <main>
        <ErrorMessage
          title="Unable to load foods"
          message={goalResponse.message ?? 'Something went wrong while loading your foods.'}
        />
      </main>
    );
  }

  const goals = goalResponse.data;
  const currentUser = userResponse.data;

  return (
    <div className="container">
      <div className="form-wrapper m-[5em] flex items-center justify-center">
        <UpdateUserForm user={currentUser} goals={goals} />
      </div>
    </div>
  );
}
