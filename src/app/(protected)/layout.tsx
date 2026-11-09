import { requireAuth } from '@/lib/auth';
import Sidebar from '@/components/sidebar/Sidebar';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  return (
    <div className="min-h-screen w-full min-w-0">
      <Sidebar />

      <main className="ml-0 min-h-screen w-full min-w-0 overflow-x-clip px-4 pt-20 pb-6 sm:px-6 sm:pb-8 lg:ml-60 lg:w-[calc(100%-15rem)] lg:p-8">
        <div className="mx-auto w-full max-w-350 min-w-0">{children}</div>
      </main>
    </div>
  );
}
