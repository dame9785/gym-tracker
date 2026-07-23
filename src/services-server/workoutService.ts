import { WorkoutRepository } from '@/repositories/workout-repository';

// Dtos
import { RegisterWorkoutDto } from '@/dto/register-workout-dto';

export class WorkoutService {
  private workoutRepository = new WorkoutRepository();

  async create(dto: RegisterWorkoutDto) {
    try {
      // Validering
      if (!dto.name.trim()) {
        return {
          success: false,
          message: 'Workout måste ha ett namn.',
        };
      }

      if (dto.workoutExercises.length === 0) {
        return {
          success: false,
          message: 'Workout måste innehålla minst en övning.',
        };
      }

      const workout = await this.workoutRepository.create(dto);

      return {
        success: true,
        message: 'Workout skapad.',
        workout,
      };
    } catch (error) {
      console.error('Kunde inte skapa workout:', error);

      return {
        success: false,
        message: 'Något gick fel när träningspasset skulle sparas.',
      };
    }
  }

  async getAll() {
    return await this.workoutRepository.getAll();
  }
}
