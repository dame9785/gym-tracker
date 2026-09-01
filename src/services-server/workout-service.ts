//Repositories
import { WorkoutRepository } from '@/repositories/workout-repository';
import { ExerciseRepository } from '@/repositories/exercise-repository';

//Types
import type { RegisterWorkoutDto } from '@/types/workout-types';

//Mapping
import { WorkoutMapper } from '@/mapping/workout-mapping';
import {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
  WorkoutApiDeleteResponse,
  WorkoutApiGetByIdResponse,
  WorkoutApiRegisterResponse,
  WorkoutApiResponse,
  WorkoutApiUpdateResponse,
} from '@/types/api-types';
import { ExerciseMapper } from '@/mapping/exericse-mapping';
import { UpdateWorkoutDto, updateWorkoutSchema } from '@/schemas/workout-schemas';
import { ErrorsHelper } from '@/helpers/error-helper';
import { errorResponse } from '@/utils/api-error';

export class WorkoutService {
  private workoutRepository = new WorkoutRepository();
  private exericseRepository = new ExerciseRepository();

  async create(dto: RegisterWorkoutDto, userId: number): Promise<ApiResponse<WorkoutApiRegisterResponse>> {
    try {
      const workout = await this.workoutRepository.create(dto, userId);

      return {
        success: true,
        message: 'Workout created successfully.',
        data: WorkoutMapper.workoutDtoToViewModel(workout),
      } satisfies ApiResponse<WorkoutApiRegisterResponse>;
    } catch (error) {
      console.error('Create workout failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async update(id: number, dto: UpdateWorkoutDto, userId: number): Promise<ApiResponse<WorkoutApiUpdateResponse>> {
    const validation = updateWorkoutSchema.safeParse(dto);

    if (!validation.success) {
      const fieldErrors = ErrorsHelper.getFormErrors<WorkoutApiUpdateResponse>(validation.error.issues);
      const errors = Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message]]));

      return {
        success: false,
        message: 'Incorrect email or password.',
        errors: errors,
      } satisfies ApiErrorResponse;
    }

    try {
      const updatedWorkout = await this.workoutRepository.update(id, dto);
      const workout = await this.workoutRepository.getById(id, userId);

      if (!workout) {
        return {
          success: false,
          message: 'Could not find workout.',
        } satisfies ApiErrorResponse;
      }

      return {
        success: true,
        data: WorkoutMapper.workoutDtoToViewModel(workout),
      } satisfies ApiResponse<WorkoutApiUpdateResponse>;
    } catch (error) {
      console.error('Update workout failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async getAll(page: number, userId: number): Promise<ApiResponse<WorkoutApiResponse>> {
    const totalNumberWorkouts = await this.workoutRepository.getTotalNumberOfWorkouts(userId);

    const pageSize = 5;
    const totalPages = Math.ceil(totalNumberWorkouts / pageSize);

    try {
      const workouts = await this.workoutRepository.getAll(userId, page, pageSize);

      return {
        success: true,
        message: 'Exericses fetched successfully.',
        data: {
          workouts: WorkoutMapper.workoutDtosToViewModels(workouts),
          pagination: {
            currentPage: page,
            totalPages,
            pageSize,
            totalItems: totalNumberWorkouts,
          },
        },
      } satisfies ApiSuccessResponse<WorkoutApiResponse>;
    } catch (error) {
      console.error('Fetch workouts failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async getById(id: number, userId: number): Promise<ApiResponse<WorkoutApiGetByIdResponse>> {
    try {
      const workout = await this.workoutRepository.getById(id, userId);
      const exerices = await this.exericseRepository.getAllExersise(userId);

      if (!workout) {
        return {
          success: false,
          message: 'Could not find workout.',
        } satisfies ApiErrorResponse;
      }

      return {
        success: true,
        message: 'Workout fetched successfully.',
        data: {
          workout: WorkoutMapper.workoutDtoToViewModel(workout),
          exericses: exerices.map((x) => ExerciseMapper.exerciseModelToViewModel(x)),
        },
      } satisfies ApiSuccessResponse<WorkoutApiGetByIdResponse>;
    } catch (error) {
      console.error('Fetch workouts by id failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async delete(id: number, userId: number): Promise<ApiResponse<WorkoutApiDeleteResponse>> {
    try {
      await this.workoutRepository.delete(id, userId);
      return {
        success: true,
        data: {
          success: true,
          message: 'Exericse deleted successfully.',
        },
      } satisfies ApiSuccessResponse<WorkoutApiDeleteResponse>;
    } catch (error) {
      console.error('Delete workout failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }
}
