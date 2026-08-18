//Next Link
import Link from 'next/link';

//Components
import Statistic from '@/components/log-weight/log-weight-statistics';
import LogHistoryList from '@/components/log-weight/log-history-list';
import WeightChart from '@/components/log-weight/weight-chart';
import Button from '@/components/button/button';

//Services
import { WeightLogService } from '@/services-server/weight-log-service';
import { getTokenFromCookieStore } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AuthService from '@/services/auth-service';
import { UserViewModel } from '@/types/user-types';

const weightLogService = new WeightLogService();

export default async function LogWeight() {
  const token = await getTokenFromCookieStore();

  if (!token) {
    redirect('/account/login');
  }

  const response = await AuthService.getCurrentUser(token);
  if (!response.success || response.data == null) {
    redirect('/account/login');
  }

  const user: UserViewModel = response.data.user;

  const result = await weightLogService.getAll(user.id);
  const LogList = result.success ? result.data.logList : [];
  const currentWeight = result.success ? result.data.currentWeight : 0;
  const startWeight = result.success ? result.data.startWeight : 0;

  return (
    <div className="container max-w-7xl">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Vikt</h1>
          <p className="mt-2 text-zinc-400">Följ din viktutveckling över tid.</p>
        </div>

        <Link href="/log-weight/create">
          <Button type="submit" variant="primary">
            Logga vikt
          </Button>
        </Link>
      </div>

      {/* Statistik */}
      <Statistic currentWeight={currentWeight} startWeight={startWeight} />

      {/* Graf */}
      <div className="mb-10 rounded-2xl">
        <div className="h-72">
          <WeightChart logList={LogList} />
        </div>
      </div>

      {/* Historik */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900" id="history-section-weight">
        <div className="border-b border-zinc-800 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Historik</h2>
        </div>

        <table className="w-full">
          <thead className="bg-zinc-950">
            <tr className="text-left text-sm text-zinc-400">
              <th className="px-6 py-3">Datum</th>
              <th className="px-6 py-3">Vikt</th>
              <th className="px-6 py-3">Anteckning</th>
              <th className="px-6 py-3">Redigera / ta bort</th>
            </tr>
          </thead>

          <tbody>
            {LogList?.map((item) => {
              return <LogHistoryList key={item.id} logItem={item} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
