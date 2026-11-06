import { requireAuth } from '@/lib/auth';
import Sidebar from '@/components/sidebar/Sidebar';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  return (
    <div className="min-h-screen min-w-0 w-full">
      <Sidebar />

      <main className="ml-0 min-h-screen min-w-0 w-full overflow-x-clip px-4 pb-6 pt-20 sm:px-6 sm:pb-8 lg:ml-60 lg:w-[calc(100%-15rem)] lg:p-8">
        <div className="mx-auto min-w-0 w-full max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}
