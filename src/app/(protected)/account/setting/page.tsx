import UpdateUserForm from '@/components/forms/user/update-user-form';
import ErrorMessage from '@/components/ui/error-message';
import { requireAuth } from '@/lib/auth';
import { AuthService } from '@/services-server/auth-service';

const authService = new AuthService();

export default async function UserSettings(): Promise<React.ReactElement> {
  const user = await requireAuth();

  let loggedInUser: Awaited<ReturnType<typeof authService.getUserById>> | null = null;

  try {
    loggedInUser = await authService.getUserById(user.userId);
  } catch {
    // The error is handled below.
  }

  if (!loggedInUser) {
    return (
      <main>
        <ErrorMessage title="Unable to load user" message="Something went wrong while loading your account." />
      </main>
    );
  }

  return (
    <div className="container">
      <div className="form-wrapper m-[5em] flex items-center justify-center">
        <UpdateUserForm user={loggedInUser} />
      </div>
    </div>
  );
}
