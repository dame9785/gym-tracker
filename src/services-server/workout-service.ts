//Repositories
import { WorkoutRepository } from '@/repositories/workout-repository';
import { ExerciseRepository } from '@/repositories/exercise-repository';

//Types
import type { DeleteWorkoutActionResult, RegisterWorkoutDto, UpdateWorkoutActionResult } from '@/types/workout-types';

//Mapping
import { WorkoutMapper } from '@/mapping/workout-mapping';
import { ErrorResponse, ApiResponse, SuccessResponse, WorkoutApiGetByIdResponse, WorkoutApiRegisterResponse, WorkoutApiResponse } from '@/types/api-types';
import { ExerciseMapper } from '@/mapping/exericse-mapping';
import { UpdateWorkoutDto } from '@/schemas/workout-schemas';

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

  async update(id: number, dto: UpdateWorkoutDto, userId: number): Promise<UpdateWorkoutActionResult> {
    try {
      //Update workout in database
      await this.workoutRepository.update(id, dto);

      const workout = await this.workoutRepository.getById(id, userId);

      if (!workout) {
        return {
          success: false,
          message: 'Could not find workout.',
        } satisfies ErrorResponse;
      }

      return {
        success: true,
        message: 'Workout updated successfully.',
        data: WorkoutMapper.workoutDtoToViewModel(workout),
      } satisfies UpdateWorkoutActionResult;
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
      } satisfies SuccessResponse<WorkoutApiResponse>;
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
        } satisfies ErrorResponse;
      }

      return {
        success: true,
        message: 'Workout fetched successfully.',
        data: {
          workout: WorkoutMapper.workoutDtoToViewModel(workout),
          exericses: exerices.map((x) => ExerciseMapper.exerciseModelToViewModel(x)),
        },
      } satisfies SuccessResponse<WorkoutApiGetByIdResponse>;
    } catch (error) {
      console.error('Fetch workouts by id failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async delete(id: number, userId: number): Promise<DeleteWorkoutActionResult> {
    try {
      await this.workoutRepository.delete(id, userId);
      return {
        success: true,
        message: 'Exericse deleted successfully.',
      } satisfies DeleteWorkoutActionResult;
    } catch (error) {
      console.error('Delete workout failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }
}
