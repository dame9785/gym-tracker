import { requireAuth } from '@/lib/auth';
import { Toaster } from 'sonner';
import Sidebar from '@/components/sidebar/Sidebar';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  return (
    <div className="min-h-screen">
      <Sidebar />

      <main className="ml-[250px] min-h-screen p-8">
        <div className="mx-auto w-full max-w-[1400px]">{children}</div>
      </main>

      <Toaster richColors position="top-right" />
    </div>
  );
}
