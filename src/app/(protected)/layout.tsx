import { redirect } from 'next/navigation';

import Sidebar from '@/components/sidebar/Sidebar';
import { getTokenFromCookieStore } from '@/lib/auth';
import AuthService from '@/services/auth-service';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = await getTokenFromCookieStore();

  if (!token) {
    redirect('/account/login');
  }

  const apiResponse = await AuthService.me(token);
  console.log(apiResponse);
  if (!apiResponse.success) {
    redirect('/account/login');
  }

  return (
    <div className="app-layout">
      <Sidebar user={apiResponse.UserSettingsViewModel ?? null} />
      <main>{children}</main>
    </div>
  );
}
