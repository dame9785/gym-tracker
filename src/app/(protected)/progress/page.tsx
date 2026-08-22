import ProgressHeader from '@/components/progress/progress-header';
import WeightProgress from '@/components/progress/progress-weight';
import { getTokenFromCookieStore } from '@/lib/auth';

import ProgressService from '@/services/progress-service';
import { redirect } from 'next/navigation';

export default async function ProgressPage() {
  const token = await getTokenFromCookieStore();

  if (!token) {
    redirect('/account/login');
  }

  const response = await ProgressService.getProgress(token);

  return (
    <div className="mx-auto max-w-7xl p-8">
      <ProgressHeader />
      <WeightProgress weightData={response.success ? response.data.weightProgress : null} />
    </div>
  );
}
