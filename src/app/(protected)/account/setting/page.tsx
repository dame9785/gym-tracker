import UserSettingsTabs from '@/components/forms/user/user-settings-tabs';
import ErrorMessage from '@/components/ui/error-message';

import { requireAuth } from '@/lib/auth';
import { AuthService } from '@/services/auth-service';

export default async function UserSettings(): Promise<React.ReactElement> {
  const user = await requireAuth();

  const authService = new AuthService();

  let loggedInUser: Awaited<ReturnType<typeof authService.getUserById>>;

  try {
    loggedInUser = await authService.getUserById(user.userId);
  } catch (error: unknown) {
    console.error('Failed to load user settings:', error);

    return (
      <main>
        <ErrorMessage title="Unable to load user" message="Something went wrong while loading your account. Please try again later." />
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <UserSettingsTabs user={loggedInUser} />
    </main>
  );
}
