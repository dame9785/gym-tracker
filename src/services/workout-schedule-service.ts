//Types
import type { RegisterWorkoutScheduleDto } from '@/types/workout-types';

//Next Redirect
import { redirect } from 'next/navigation';

export default class WorkoutScheduleService {
  static async create(dto: RegisterWorkoutScheduleDto) {
    try {
      const response = await fetch('/api/workout-schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(text);

        return {
          success: false,
          message: 'Något gick fel.',
        };
      }

      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }
}
