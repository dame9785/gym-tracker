import { RegisterWorkoutScheduleDto } from '@/dto/register-workout-schedule-dto';
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
      console.error('Error', error);

      return {
        success: false,
        message: 'Något gick fel.',
      };
    }
  }
}
