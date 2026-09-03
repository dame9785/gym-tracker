import UpdateUserForm from '@/components/forms/user/update-user-form';
import { AuthService } from '@/services-server/auth-service';
import ErrorMessage from '@/components/ui/error-message';
import { requireAuth } from '@/lib/auth';

const authService = new AuthService();

export default async function UserSettings() {
  // Kontrollera att användaren är inloggad
  const user = await requireAuth();

  /* Fetch all goal types & Current User*/
  const userResponse = await authService.getUserById(user.userId);

  if (!userResponse.success || !userResponse.data) {
    return (
      <main>
        <ErrorMessage
          title="Unable to load foods"
          message={userResponse.message ?? 'Something went wrong while loading your foods.'}
        />
      </main>
    );
  }

  const loggedInUserr = userResponse.data;

  return (
    <div className="container">
      <div className="form-wrapper m-[5em] flex items-center justify-center">
        <UpdateUserForm user={loggedInUserr} />
      </div>
    </div>
  );
}
