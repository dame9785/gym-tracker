'use client';

import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { ExerciseProgressEntry } from '@/types/progress-type';

type ChartMetric = 'weight' | 'reps' | 'seconds';

type Props = {
  history: ExerciseProgressEntry[];
  metric: ChartMetric;
};

type ChartPoint = {
  dateKey: string;
  dateLabel: string;
  value: number;
  setCount: number;
};

function getDateKey(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  // Group sets by local calendar day.
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDateLabel(dateKey: string): string {
  const date = new Date(`${dateKey}T12:00:00`);

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
}

function formatValue(value: number): string {
  return value.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  });
}

export default function ExerciseChart({ history, metric }: Props) {
  const data = useMemo<ChartPoint[]>(() => {
    const grouped = new Map<string, ExerciseProgressEntry[]>();

    for (const entry of history) {
      const dateKey = getDateKey(entry.loggedAt);

      if (!dateKey) {
        continue;
      }

      const dayEntries = grouped.get(dateKey) ?? [];

      dayEntries.push(entry);
      grouped.set(dateKey, dayEntries);
    }

    return Array.from(grouped.entries())
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([dateKey, entries]) => {
        const values = entries.map((entry) => {
          if (metric === 'weight') {
            return Number.isFinite(entry.weight) ? entry.weight : 0;
          }

          if (metric === 'reps') {
            return Number.isFinite(entry.reps) ? entry.reps : 0;
          }

          return Number.isFinite(entry.seconds) ? (entry.seconds ?? 0) : 0;
        });

        return {
          dateKey,
          dateLabel: formatDateLabel(dateKey),
          value: Math.max(...values),
          setCount: entries.length,
        };
      });
  }, [history, metric]);

  const metricLabel = metric === 'weight' ? 'Weight' : metric === 'reps' ? 'Reps' : 'Time';

  const unit = metric === 'weight' ? 'kg' : metric === 'reps' ? 'reps' : 'sec';

  const maxValue = data.reduce((max, point) => Math.max(max, point.value), 0);

  if (data.length === 0) {
    return <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 text-center text-sm text-zinc-500">No training history available yet. Record a workout result to start tracking your progress.</div>;
  }

  return (
    <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-3 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-white">{metricLabel} per Training Day</p>

          <p className="mt-1 text-xs text-zinc-500">Each point shows the highest recorded value for that day.</p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-purple-300">
            {formatValue(maxValue)} {unit}
          </p>

          <p className="text-xs text-zinc-500">Best Daily Result</p>
        </div>
      </div>

      <div className="h-64 w-full sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 12, left: -12, bottom: 4 }}>
            <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="dateLabel" tick={{ fill: '#a1a1aa', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#3f3f46' }} minTickGap={18} />

            <YAxis domain={[0, (dataMax: number) => Math.max(dataMax, 1) * 1.15]} allowDecimals={metric === 'weight'} tick={{ fill: '#a1a1aa', fontSize: 12 }} tickLine={false} axisLine={false} width={48} tickFormatter={(value: number) => formatValue(value)} />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) {
                  return null;
                }

                const point = payload[0]?.payload as ChartPoint | undefined;

                if (!point) {
                  return null;
                }

                return (
                  <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-xl">
                    <p className="text-xs text-zinc-400">
                      {new Date(`${point.dateKey}T12:00:00`).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {formatValue(point.value)} {unit}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {point.setCount} {point.setCount === 1 ? 'set recorded' : 'sets recorded'}
                    </p>
                  </div>
                );
              }}
              cursor={{
                stroke: '#71717a',
                strokeDasharray: '4 4',
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              name={metricLabel}
              stroke="#a78bfa"
              strokeWidth={2.5}
              dot={{
                r: data.length === 1 ? 5 : 3,
                fill: '#a78bfa',
                strokeWidth: 0,
              }}
              activeDot={{
                r: 6,
                fill: '#c4b5fd',
                stroke: '#18181b',
                strokeWidth: 2,
              }}
              connectNulls
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-xs text-zinc-500">{data.length === 1 ? 'You have one recorded training day. As you record more workouts, your progress over time will appear here.' : `${data.length} training days displayed from oldest to newest entry.`}</p>
    </div>
  );
}
