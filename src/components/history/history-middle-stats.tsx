import { Clock3, Layers3 } from 'lucide-react';

import type { TotalTrainingTimeViewModel } from '@/types/history-types';
import StatsCard from '@/components/ui/stats-card';

type Props = {
  totalTrainingTime: TotalTrainingTimeViewModel;
  totalCompletedSets: number;
};

export default function HistoryMiddleStats({ totalTrainingTime, totalCompletedSets }: Props) {
  const formatTrainingTime = () => {
    const { hours, minutes, seconds } = totalTrainingTime;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;

    return `${seconds}s`;
  };

  const stats = [
    {
      icon: <Clock3 />,
      title: 'Total Training Time',
      value: formatTrainingTime(),
      subtitle: 'Time spent training',
    },
    {
      icon: <Layers3 />,
      title: 'Completed Sets',
      value: totalCompletedSets.toLocaleString('en-US'),
      subtitle: 'Successfully completed sets',
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <StatsCard key={stat.title} icon={stat.icon} title={stat.title} value={stat.value} subtitle={stat.subtitle} />
      ))}
    </>
  );
}
