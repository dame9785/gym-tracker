//Repositories
import { WorkoutRepository } from '@/repositories/workout-repository';

//Types
import type { RegisterWorkoutDto, EditWorkoutDto } from '@/types/workout-types';

//Mapping
import { WorkoutMapper } from '@/mapping/workout-mapping';
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse, WorkoutApiResponse } from '@/types/api-types';

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

  async update(id: number, dto: EditWorkoutDto) {
    try {
      const workout = await this.workoutRepository.update(id, dto);
      return {
        success: true,
        message: 'Träningspass sparad',
        workout: workout,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Något gick fel när träningspassen skulle hämtas.',
        workout: [],
      };
    }
  }

  async getAll(): Promise<ApiResponse<WorkoutApiResponse>> {
    try {
      const workouts = await this.workoutRepository.getAll();

      return {
        success: true,
        data: {
          workouts: WorkoutMapper.workoutDtosToViewModels(workouts),
        },
      } satisfies ApiSuccessResponse<WorkoutApiResponse>;
    } catch (error) {
      console.error('Kunde inte hämta workouts:', error);

      return {
        success: false,
        message: 'Server fel, kunde inte hämta workouts',
      } satisfies ApiErrorResponse;
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

      const viewModel = WorkoutMapper.workoutDtoToViewModel(workout);
      return {
        success: true,
        workout: viewModel,
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
