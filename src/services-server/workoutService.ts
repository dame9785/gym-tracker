import { WorkoutRepository } from '@/repositories/workout-repository';

//Dtos
import { RegisterWorkoutDto } from '@/dto/register-workout-dto';

export class WorkoutService {
  private workoutRepository = new WorkoutRepository();

  async create(dto: RegisterWorkoutDto) {
    // Här kommer senare validering

    await this.workoutRepository.create(dto);

    return {
      success: true,
      message: 'Workout skapad.',
    };
  }
}
