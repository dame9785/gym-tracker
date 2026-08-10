import { redirect } from 'next/navigation';

import Sidebar from '@/components/sidebar/Sidebar';
import { getTokenFromCookieStore } from '@/lib/auth';
import AuthService from '@/services/auth-service';
import { UserViewModel } from '@/types/user-types';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = await getTokenFromCookieStore();

  if (!token) {
    redirect('/account/login');
  }

  const response = await AuthService.getCurrentUser(token);
  console.log(response);
  if (!response.success || response.data == null) {
    redirect('/account/login');
  }

  const user: UserViewModel = response.data.user;
  return (
    <div className="app-layout">
      <Sidebar user={user} />
      <main>{children}</main>
    </div>
  );
}
