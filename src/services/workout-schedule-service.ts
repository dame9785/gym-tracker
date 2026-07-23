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

    return await response.json();
  }
}
