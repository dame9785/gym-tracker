import { redirect } from 'next/navigation';

import { getTokenFromCookieStore } from '@/lib/auth';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = await getTokenFromCookieStore();

  console.log(token);
  if (!token) {
    redirect('/account/login');
  }

  return (
    <div className="app-layout">
      <main>{children}</main>
    </div>
  );
}
