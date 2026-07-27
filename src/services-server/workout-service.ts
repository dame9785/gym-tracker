//Repositories
import { WorkoutRepository } from '@/repositories/workout-repository';

// DTO:S
import { RegisterWorkoutDto } from '@/dto/register-workout-dto';
import { WorkoutMapper } from '@/mapping/workout-mapping';

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
    try {
      const workouts = await this.workoutRepository.getAll();
      const viewModels = WorkoutMapper.workoutDtosToViewModels(workouts);
      return {
        success: true,
        workouts: viewModels,
      };
    } catch (error) {
      console.error('Kunde inte hämta workouts:', error);

      return {
        success: false,
        message: 'Något gick fel när träningspassen skulle hämtas.',
      };
    }
  }

  async getById(id: number) {
    try {
      const workout = await this.workoutRepository.getById(id);
      if (!workout) {
        return {
          success: false,
          message: 'Workout hittades inte.',
        };
      }

      const workoutViewModel = WorkoutMapper.workoutDtoToViewModel(workout);

      return {
        success: true,
        workout: workoutViewModel,
      };
    } catch (error) {
      console.error('Kunde inte hämta workout:', error);

      return {
        success: false,
        message: 'Något gick fel när träningspasset skulle hämtas.',
      };
    }
  }

  async delete(id: number) {
    try {
      await this.workoutRepository.delete(id);
      return {
        success: true,
        message: 'Bortagning lyckades',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Något gick fel, gick inte ta bort träningspasset',
      };
    }
  }
}
