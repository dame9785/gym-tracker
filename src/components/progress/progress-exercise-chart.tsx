'use client';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { ExerciseProgressEntry } from '@/types/progress-type';

type Props = {
  history: ExerciseProgressEntry[];
};

export default function ExerciseChart({ history }: Props) {
  const data = history.map((entry) => ({
    date: new Date(entry.loggedAt).toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'short',
    }),
    weight: entry.weight,
    reps: entry.reps,
  }));

  return (
    <div className="mt-6 h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />

          <XAxis dataKey="date" stroke="#71717a" tickLine={false} axisLine={false} />

          <YAxis stroke="#71717a" tickLine={false} axisLine={false} unit=" kg" />

          <Tooltip
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

          <Line type="monotone" dataKey="weight" stroke="#a855f7" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
