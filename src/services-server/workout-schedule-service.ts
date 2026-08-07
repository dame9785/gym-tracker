//Types
import type { RegisterWorkoutScheduleDto } from '@/types/workout-types';

//Repository
import { WorkoutScheduleRepository } from '@/repositories/workout-schedule-repository';

export class WorkoutScheduleService {
  private workoutScheduleRepository = new WorkoutScheduleRepository();

  async create(dto: RegisterWorkoutScheduleDto) {
    try {
      const workoutSchedule = await this.workoutScheduleRepository.create(dto);

      return {
        success: true,
        message: 'Träningspass planerat.',
        workoutSchedule,
      };
    } catch (error) {
      console.error('WorkoutScheduleService.create ERROR:', error);

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Något gick fel.',
      };
    }
  }
}
