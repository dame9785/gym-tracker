'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import { TrendingUp } from 'lucide-react';

import type { LogItemViewModel } from '@/types/log-weight-types';

type WeightChartProps = {
  logList: LogItemViewModel[];
};

export default function WeightChart({ logList }: WeightChartProps) {
  const chartData = [...logList]
    .sort((a, b) => new Date(a.logDate ?? '').getTime() - new Date(b.logDate ?? '').getTime())
    .map((log) => ({
      date: new Date(log.logDate ?? '').toLocaleDateString('sv-SE', {
        day: 'numeric',
        month: 'short',
      }),
      weight: Number(log.weight),
    }));

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 sm:p-6">
      {/* Header */}
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 sm:text-xs">Progress</p>

          <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">Weight Progress</h2>

          <p className="mt-1 text-xs text-zinc-500 sm:text-sm">Your weight over time</p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 sm:h-10 sm:w-10">
          <TrendingUp className="h-4 w-4 text-orange-400 sm:h-5 sm:w-5" />
        </div>
      </div>

      {/* Chart */}
      <div className="mt-5 w-full min-w-0 sm:mt-6">
        {chartData.length > 0 ? (
          <div className="w-full min-w-0" style={{ height: '260px', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={260} minWidth={0}>
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />

                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} tickMargin={10} />

                <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} width={38} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #3f3f46',
                    borderRadius: '12px',
                  }}
                  labelStyle={{ color: '#a1a1aa' }}
                  formatter={(value) => [`${value} kg`, 'Weight']}
                />

                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  dot={{
                    r: 4,
                    fill: '#18181b',
                    stroke: '#f97316',
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[260px] items-center justify-center text-sm text-zinc-500">No weight data available yet.</div>
        )}
      </div>
    </div>
  );
}
