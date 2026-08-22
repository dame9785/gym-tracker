//Repositories
import { WorkoutRepository } from '@/repositories/workout-repository';
import { ExerciseRepository } from '@/repositories/exercise-repository';

//Types
import type { RegisterWorkoutDto } from '@/types/workout-types';

//Mapping
import { WorkoutMapper } from '@/mapping/workout-mapping';
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse, WorkoutApiDeleteResponse, WorkoutApiGetByIdResponse, WorkoutApiRegisterResponse, WorkoutApiResponse, WorkoutApiUpdateResponse } from '@/types/api-types';
import { ExerciseMapper } from '@/mapping/exericse-mapping';
import { UpdateWorkoutDto, updateWorkoutSchema } from '@/schemas/workout-schemas';
import { ErrorsHelper } from '@/helpers/error-helper';

export class WorkoutService {
  private workoutRepository = new WorkoutRepository();
  private exericseRepository = new ExerciseRepository();

  async create(dto: RegisterWorkoutDto, userId: number): Promise<ApiResponse<WorkoutApiRegisterResponse>> {
    try {
      const workout = await this.workoutRepository.create(dto, userId);

      return {
        success: true,
        message: 'Workout skapad.',
        data: {
          workout: WorkoutMapper.workoutDtoToViewModel(workout),
        },
      } satisfies ApiResponse<WorkoutApiRegisterResponse>;
    } catch (error) {
      console.error('Kunde inte skapa workout:', error);

      return {
        success: false,
        message: 'Server fel, kunde inte hämta workouts',
      } satisfies ApiErrorResponse;
    }
  }

  async update(id: number, dto: UpdateWorkoutDto): Promise<ApiResponse<WorkoutApiUpdateResponse>> {
    const validation = updateWorkoutSchema.safeParse(dto);

    if (!validation.success) {
      const fieldErrors = ErrorsHelper.getFormErrors<WorkoutApiUpdateResponse>(validation.error.issues);
      const errors = Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message]]));

      return {
        success: false,
        message: 'Felaktig email eller lösenord.',
        errors: errors,
      } satisfies ApiErrorResponse;
    }
    try {
      const updatedWorkout = await this.workoutRepository.update(id, dto);
      const workout = await this.workoutRepository.getById(id);

      if (!workout) {
        return {
          success: false,
          message: 'Något gick fel, gick inte ta bort träningspasset',
        } satisfies ApiErrorResponse;
      }

      return {
        success: true,
        data: {
          workout: WorkoutMapper.workoutDtoToViewModel(workout),
        },
      } satisfies ApiResponse<WorkoutApiUpdateResponse>;
    } catch (error) {
      console.error('Kunde inte hämta workouts:', error);

      return {
        success: false,
        message: 'Server fel, kunde inte hämta workouts',
      } satisfies ApiErrorResponse;
    }
  }

  async getAll(userId: number): Promise<ApiResponse<WorkoutApiResponse>> {
    try {
      const workouts = await this.workoutRepository.getAll(userId);

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

  async getById(id: number): Promise<ApiResponse<WorkoutApiGetByIdResponse>> {
    try {
      const workout = await this.workoutRepository.getById(id);
      const exerices = await this.exericseRepository.getAll();

      if (!workout) {
        return {
          success: false,
          message: 'Något gick fel, gick inte ta bort träningspasset',
        } satisfies ApiErrorResponse;
      }

      return {
        success: true,
        data: {
          workout: WorkoutMapper.workoutDtoToViewModel(workout),
          exericses: exerices.map((x) => ExerciseMapper.exerciseModelToViewModel(x)),
        },
      } satisfies ApiSuccessResponse<WorkoutApiGetByIdResponse>;
    } catch (error) {
      console.error('Kunde inte hämta workout:', error);

      return {
        success: false,
        message: 'Något gick fel, gick inte ta bort träningspasset',
      } satisfies ApiErrorResponse;
    }
  }

  async delete(id: number): Promise<ApiResponse<WorkoutApiDeleteResponse>> {
    try {
      await this.workoutRepository.delete(id);
      return {
        success: true,
        data: {
          success: true,
          message: 'Träningspasset raderad!',
        },
      } satisfies ApiSuccessResponse<WorkoutApiDeleteResponse>;
    } catch (error) {
      return {
        success: false,
        message: 'Något gick fel, gick inte ta bort träningspasset',
      } satisfies ApiErrorResponse;
    }
  }
}
