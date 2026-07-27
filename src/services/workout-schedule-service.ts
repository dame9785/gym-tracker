import type { RegisterWorkoutScheduleDto } from '@/dto/register-workout-schedule-dto';

export default class WorkoutScheduleService {
  static async create(dto: RegisterWorkoutScheduleDto) {
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
  }
}
