'use client';

//Types
import type { LogItemViewModel } from '@/types/log-weight-types';

//Recharts
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

//Props
type WeightChartProps = {
  logList: LogItemViewModel[];
};

export default function WeightChart({ logList }: WeightChartProps) {
  const chartData = [...logList]
    .sort((a, b) => new Date(a.logDate ?? '').getTime() - new Date(b.logDate ?? '').getTime())
    .map((log) => ({
      date: new Date(log.logDate ?? '').toLocaleDateString('sv-SE'),
      weight: Number(log.weight),
    }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid stroke="#3f3f46" strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke="#a1a1aa" />

        <YAxis domain={['auto', 'auto']} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#18181b',
            border: '1px solid #3f3f46',
            borderRadius: 12,
          }}
        />
        <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={3} dot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
