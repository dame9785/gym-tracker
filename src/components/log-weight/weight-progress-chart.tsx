'use client';

import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { WeightProgressEntry } from '@/types/progress-type';

type Props = {
  history: WeightProgressEntry[];
  startWeight?: number;
  goalWeight?: number;
};

export default function WeightProgressChart({ history, startWeight, goalWeight }: Props) {
  const sortedHistory = [...history].filter((entry) => Number.isFinite(Number(entry.weight)) && Number(entry.weight) > 0 && !Number.isNaN(new Date(entry.loggedAt).getTime())).sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime());

  const data = sortedHistory.map((entry) => ({
    ...entry,
    weight: Number(entry.weight),
    date: new Date(entry.loggedAt).toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'short',
    }),
  }));

  const latestEntry = data[data.length - 1];

  const highestEntry = data.length > 0 ? data.reduce((highest, entry) => (entry.weight > highest.weight ? entry : highest)) : undefined;

  const lowestEntry = data.length > 0 ? data.reduce((lowest, entry) => (entry.weight < lowest.weight ? entry : lowest)) : undefined;

  const formatWeight = (weight: number) =>
    weight.toLocaleString('sv-SE', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const weights = [...data.map((entry) => entry.weight), ...(startWeight !== undefined && Number.isFinite(startWeight) ? [startWeight] : []), ...(goalWeight !== undefined && Number.isFinite(goalWeight) ? [goalWeight] : [])];

  const minWeight = weights.length ? Math.min(...weights) : 0;
  const maxWeight = weights.length ? Math.max(...weights) : 100;
  const padding = Math.max((maxWeight - minWeight) * 0.15, 1);

  const yMin = Math.floor(minWeight - padding);
  const yMax = Math.ceil(maxWeight + padding);

  return (
    <section aria-labelledby="weight-chart-title" className="mb-10 w-full min-w-0 rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-4 sm:p-8">
      <header className="mb-6">
        <h2 id="weight-chart-title" className="text-xl font-bold text-white">
          Viktutveckling
        </h2>

        <p className="mt-1 text-sm text-zinc-400">Följ din vikt över tid och jämför med din startvikt och målvikt.</p>
      </header>

      {data.length === 0 ? (
        <p role="status" className="text-sm text-zinc-400">
          Ingen vikthistorik registrerad ännu.
        </p>
      ) : (
        <>
          {/* Statistik */}
          <dl className="mb-10 grid grid-cols-1 gap-3 xl:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
              <dt className="text-xs text-zinc-200">Aktuell vikt</dt>

              <dd className="mt-2 text-xl font-bold text-orange-400">{latestEntry ? `${formatWeight(latestEntry.weight)} kg` : '—'}</dd>

              <dd className="mt-1 text-xs text-zinc-500">{latestEntry ? formatDate(latestEntry.loggedAt) : 'Ingen registrering'}</dd>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
              <dt className="text-xs text-zinc-200">Högsta vikt</dt>

              <dd className="mt-2 text-xl font-bold text-red-400">{highestEntry ? `${formatWeight(highestEntry.weight)} kg` : '—'}</dd>

              <dd className="mt-1 text-xs text-zinc-500">{highestEntry ? formatDate(highestEntry.loggedAt) : 'Ingen registrering'}</dd>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
              <dt className="text-xs text-zinc-200">Lägsta vikt</dt>

              <dd className="mt-2 text-xl font-bold text-emerald-400">{lowestEntry ? `${formatWeight(lowestEntry.weight)} kg` : '—'}</dd>

              <dd className="mt-1 text-xs text-zinc-500">{lowestEntry ? formatDate(lowestEntry.loggedAt) : 'Ingen registrering'}</dd>
            </div>
          </dl>

          {/* Förklaring */}
          <ul aria-label="Diagramförklaring" className="mb-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-zinc-400">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="h-0.5 w-5 rounded bg-violet-400" />
              Registrerad vikt
            </li>

            {startWeight !== undefined && (
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="w-5 border-t-2 border-dashed border-orange-400" />
                Startvikt ({formatWeight(startWeight)} kg)
              </li>
            )}

            {goalWeight !== undefined && (
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="w-5 border-t-2 border-dashed border-emerald-400" />
                Målvikt ({formatWeight(goalWeight)} kg)
              </li>
            )}
          </ul>

          {/* Diagram */}
          <figure aria-label="Diagram över viktutveckling" className="min-w-0">
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }} accessibilityLayer>
                  <CartesianGrid stroke="#3f3f46" strokeDasharray="4 4" vertical={false} />

                  <XAxis dataKey="date" stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 12 }} tickLine={false} axisLine={false} />

                  <YAxis domain={[yMin, yMax]} stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 12 }} tickLine={false} axisLine={false} width={45} tickFormatter={(value) => formatWeight(Number(value))} />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #3f3f46',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    labelStyle={{
                      color: '#a1a1aa',
                      marginBottom: 4,
                    }}
                    formatter={(value) => [`${formatWeight(Number(value))} kg`, 'Vikt']}
                    labelFormatter={(_, payload) => {
                      const loggedAt = payload?.[0]?.payload?.loggedAt;

                      return loggedAt ? formatDate(loggedAt) : '';
                    }}
                  />

                  {startWeight !== undefined && <ReferenceLine y={startWeight} stroke="#fb923c" strokeDasharray="6 4" strokeWidth={2} ifOverflow="extendDomain" />}

                  {goalWeight !== undefined && <ReferenceLine y={goalWeight} stroke="#34d399" strokeDasharray="6 4" strokeWidth={2} ifOverflow="extendDomain" />}

                  <Line
                    type="monotone"
                    dataKey="weight"
                    name="Vikt"
                    stroke="#a78bfa"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: '#a78bfa',
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 6,
                      fill: '#c4b5fd',
                    }}
                    connectNulls
                    isAnimationActive
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <figcaption className="sr-only">Diagrammet visar registrerad vikt över tid, samt startvikt och målvikt.</figcaption>
          </figure>
        </>
      )}
    </section>
  );
}
