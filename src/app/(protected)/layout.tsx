import { requireAuth } from '@/lib/auth';
import { Toaster } from 'sonner';
import Sidebar from '@/components/sidebar/Sidebar';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();

  return (
    <div className="app-layout">
      <main>{children}</main>
      <Sidebar />
      <Toaster richColors position="top-right" />
    </div>
  );
}
