import { FaCheckCircle, FaClock, FaDumbbell, FaTrophy } from 'react-icons/fa';

import type { HistoryViewModel } from '@/types/history-types';
import StatsCard from '@/components/ui/stats-card';

type Props = {
  data: HistoryViewModel;
};

export default function HistoryTopStats({ data }: Props) {
  const remaining = Math.max(0, data.totalWorkouts - data.totalCompletedWorkouts);

  const completionRate = data.totalWorkouts > 0 ? Math.round((data.totalCompletedWorkouts / data.totalWorkouts) * 100) : 0;

  const stats = [
    {
      icon: <FaDumbbell />,
      title: 'Total Workouts',
      value: `${data.totalWorkouts} workouts`,
      subtitle: 'All scheduled workouts',
    },
    {
      icon: <FaCheckCircle />,
      title: 'Completed',
      value: `${data.totalCompletedWorkouts} workouts`,
      subtitle: 'Successfully completed',
    },
    {
      icon: <FaClock />,
      title: 'Remaining',
      value: `${remaining} workouts`,
      subtitle: 'Workouts left to complete',
    },
    {
      icon: <FaTrophy />,
      title: 'Completion Rate',
      value: `${completionRate}%`,
      subtitle: `${data.totalCompletedWorkouts} of ${data.totalWorkouts} workouts completed`,
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
