import { FaDumbbell, FaFire } from 'react-icons/fa';
import { BsClock } from 'react-icons/bs';

import type { WeeklySummaryViewModel } from '@/types/dashboard-types';
import StatsCard from '@/components/ui/stats-card';

type DashboardStatsProps = {
  summary: WeeklySummaryViewModel;
};

export default function DashboardStats({ summary }: DashboardStatsProps) {
  const stats = [
    {
      icon: <FaDumbbell />,
      title: 'Planned workouts',
      value: `${summary.plannedWorkouts} workouts`,
      subtitle: 'All upcoming scheduled workouts',
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
      value: `${summary.streak} days`,
      subtitle: 'Consecutive training days',
    },
  ];

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <StatsCard key={stat.title} icon={stat.icon} title={stat.title} value={stat.value} subtitle={stat.subtitle} />
      ))}
    </div>
  );
}
