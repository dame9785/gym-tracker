import { TotalTrainingTimeViewModel } from '@/types/history-types';
import { Clock3, Layers3 } from 'lucide-react';

type Props = {
  totalTrainingTime: TotalTrainingTimeViewModel;
  totalCompletedSets: number;
};

export default function TrainingTimeStats({ totalTrainingTime, totalCompletedSets }: Props) {
  const formatTrainingTime = () => {
    const { hours, minutes, seconds } = totalTrainingTime;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;

    return `${seconds}s`;
  };

  const stats = [
    {
      icon: <Clock3 className="h-5 w-5" />,
      title: 'Total Training Time',
      value: formatTrainingTime(),
      description: 'Time spent training',
    },
    {
      icon: <Layers3 className="h-5 w-5" />,
      title: 'Completed Sets',
      value: totalCompletedSets.toLocaleString('en-US'),
      description: 'Successfully completed sets',
    },
  ];

  return (
    <section className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
      {stats.map((stat) => (
        <article key={stat.title} className="group relative flex min-w-0 items-center justify-between gap-4 overflow-hidden rounded-2xl border border-zinc-800/80 bg-linear-to-br from-zinc-900 to-zinc-950 p-5 transition-all duration-300 hover:border-orange-500/30 sm:p-6">
          <div className="absolute inset-y-0 left-0 w-1 bg-orange-500/70 opacity-60 transition-opacity group-hover:opacity-100" />

          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-orange-500/10 bg-orange-500/10 text-orange-400">{stat.icon}</div>

            <div className="min-w-0">
              <h3 className="text-sm font-medium text-zinc-400">{stat.title}</h3>
              <p className="mt-1 text-xs text-zinc-500">{stat.description}</p>
            </div>
          </div>

          <p className="shrink-0 text-xl font-bold tracking-tight text-orange-400 sm:text-2xl">{stat.value}</p>
        </article>
      ))}
    </section>
  );
}
