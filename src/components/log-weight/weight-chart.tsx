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
    <div
      className="
        rounded-2xl
        border border-zinc-800
        bg-gradient-to-br from-zinc-900 to-zinc-950
        p-6
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Progress</p>

          <h2 className="mt-1 text-xl font-bold text-white">Weight Progress</h2>

          <p className="mt-1 text-sm text-zinc-500">Your weight over time</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
          <TrendingUp className="h-5 w-5 text-orange-400" />
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#71717a',
                fontSize: 11,
              }}
              dy={10}
            />

            <YAxis
              domain={['auto', 'auto']}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#71717a',
                fontSize: 11,
              }}
              tickFormatter={(value) => `${value}`}
              width={45}
            />

            <Tooltip
              cursor={{
                stroke: '#52525b',
                strokeDasharray: '4 4',
              }}
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #3f3f46',
                borderRadius: '12px',
              }}
              labelStyle={{
                color: '#a1a1aa',
              }}
              formatter={(value) => [`${value} kg`, 'Weight']}
            />

            <Line
              type="monotone"
              dataKey="weight"
              stroke="#f97316"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: '#18181b',
                stroke: '#f97316',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: '#f97316',
                stroke: '#fff',
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
