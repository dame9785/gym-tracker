//Next Link
import Link from 'next/link';

//Components
import Statistic from '@/components/log-weight/log-weight-statistics';
import LogHistoryList from '@/components/log-weight/log-history-list';
import WeightChart from '@/components/log-weight/weight-chart';
import Button from '@/components/button/button';

//Services
import { WeightLogService } from '@/services-server/weight-log-service';

const weightLogService = new WeightLogService();

export default async function LogWeight() {
  const data = await weightLogService.getAll();
  const logList = data.log?.logList;

  return (
    <div className="container max-w-7xl">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Vikt</h1>
          <p className="mt-2 text-zinc-400">Följ din viktutveckling över tid.</p>
        </div>

        <Link href="/log-weight/create">
          <Button type="button" text="Logga vikt" variant="secondary" />
        </Link>
      </div>

      {/* Statistik */}
      <Statistic currentWeight={data.log?.currentWeight} startWeight={data.log?.startWeight} />

      {/* Graf */}
      <div className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">Viktutveckling</h2>

        <div className="h-72">
          <WeightChart logList={logList ?? []} />
        </div>
      </div>

      {/* Historik */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900">
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
            {logList?.map((item) => {
              return <LogHistoryList key={item.id} logItem={item} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
