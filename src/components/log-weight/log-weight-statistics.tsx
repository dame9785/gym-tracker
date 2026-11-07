import { Scale, TrendingDown, TrendingUp } from 'lucide-react';

import DashboardStatCard from '@/components/dashboard/dashboard-stat-card';

type StatisticProps = {
  currentWeight: number | null;
  startWeight: number | null;
};

export default function Statistic({ currentWeight, startWeight }: StatisticProps) {
  const current = Number(currentWeight ?? 0);
  const start = Number(startWeight ?? 0);

  const difference = current - start;

  const stats = [
    {
      icon: <Scale />,
      title: 'Nuvarande vikt',
      value: `${currentWeight ?? 0} kg`,
      subtitle: 'Din senaste registrerade vikt',
    },
    {
      icon: <Scale />,
      title: 'Startvikt',
      value: `${startWeight ?? 0} kg`,
      subtitle: 'Din ursprungliga vikt',
    },
    {
      icon: difference >= 0 ? <TrendingUp /> : <TrendingDown />,
      title: 'Förändring',
      value: `${difference > 0 ? '+' : ''}${difference.toFixed(1)} kg`,
      subtitle: 'Förändring sedan start',
    },
  ];

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <DashboardStatCard key={stat.title} icon={stat.icon} title={stat.title} value={stat.value} subtitle={stat.subtitle} />
      ))}
    </div>
  );
}
