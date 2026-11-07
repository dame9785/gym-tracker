
import { FaDumbbell, FaFire } from 'react-icons/fa';
import { BsClock } from 'react-icons/bs';

import type { WeeklySummaryViewModel } from '@/types/dashboard-types';
import DashboardStatCard from '@/components/dashboard/dashboard-stat-card';

type DashboardStatsProps = {
  summary: WeeklySummaryViewModel;
};

export default function DashboardStats({ summary }: DashboardStatsProps) {
  const stats = [
    {
      icon: <FaDumbbell />,
      title: 'Workouts this week',
      value: summary.workouts,
      subtitle: 'Scheduled workouts',
    },
    {
      icon: <BsClock />,
      title: 'Training time',
      value: `${summary.trainingTime} min`,
      subtitle: 'Estimated this week',
    },
    {
      icon: <FaFire />,
      title: 'Current streak',
      value: summary.streak,
      subtitle: 'Consecutive training days',
    },
  ];

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
      {stats.map((stat) => (
        <DashboardStatCard
          key={stat.title}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
        />
      ))}
    </div>
  );
}
