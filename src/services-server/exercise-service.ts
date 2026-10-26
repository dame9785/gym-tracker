import { ExerciseRepository } from '../repositories/exercise-repository';

import { ExerciseMapper } from '@/mapping/exericse-mapping';
import {
  ApiResponse,
  ExerciseApiDeleteResponse,
  ExerciseApiGetByIdResponse,
  ExerciseApiRegisterResponse,
  ExerciseApiResponse,
  ExerciseApiUpdateResponse,
  SuccessResponse,
} from '@/types/api-types';
import { registerExerciseSchema, RegisterExericseDto, updateExerciseSchema, UpdateExericseDto } from '@/schemas/exercise-schema';
import { errorResponse } from '@/utils/api-error';

export class ExerciseService {
  private exerciseRepository = new ExerciseRepository();

  async getAllExersise(userId: number): Promise<ApiResponse<ExerciseApiResponse>> {
    try {
      const exercises = await this.exerciseRepository.getAllExersise(userId);

      return {
        success: true,
        data: exercises.map((exercise) => ExerciseMapper.exerciseModelToViewModel(exercise)),
      };
    } catch (error) {
      console.error('Get all exercises failed:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async delete(id: number, userId: number): Promise<ApiResponse<ExerciseApiDeleteResponse>> {
    try {
      await this.exerciseRepository.delete(id, userId);

      return {
        success: true,
        message: 'Exercise deleted successfully.',
        data: {
          success: true,
          message: 'Exercise deleted successfully.',
        },
      } satisfies SuccessResponse<ExerciseApiDeleteResponse>;
    } catch (error) {
      console.error('Delete exercise failed:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async registerExercise(dto: RegisterExericseDto, userId: number): Promise<ApiResponse<ExerciseApiRegisterResponse>> {
    const validation = registerExerciseSchema.safeParse(dto);

    if (!validation.success) {
      return errorResponse('Validation failed.', validation.error.flatten().fieldErrors);
    }

    try {
      const exercise = await this.exerciseRepository.register(validation.data, userId);

      return {
        success: true,
        message: 'Exercise created successfully.',
        data: ExerciseMapper.exerciseModelToViewModel(exercise),
      } satisfies SuccessResponse<ExerciseApiRegisterResponse>;
    } catch (error) {
      console.error('Create exercise failed:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async getById(id: number, userId: number): Promise<ApiResponse<ExerciseApiGetByIdResponse>> {
    try {
      const exercise = await this.exerciseRepository.getById(id, userId);

      if (!exercise) {
        return errorResponse('Could not find exercise.');
      }

      return {
        success: true,
        message: 'Exercise fetched successfully.',
        data: ExerciseMapper.exerciseModelToViewModel(exercise),
      } satisfies SuccessResponse<ExerciseApiGetByIdResponse>;
    } catch (error) {
      console.error('Fetch exercise by id failed:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async getBySlug(slug: string, userId: number): Promise<ApiResponse<ExerciseApiGetByIdResponse>> {
    try {
      const exercise = await this.exerciseRepository.getBySlug(slug, userId);

      if (!exercise) {
        return errorResponse('Could not find exercise.');
      }

      return {
        success: true,
        message: 'Exercise fetched successfully.',
        data: ExerciseMapper.exerciseModelToViewModel(exercise),
      } satisfies SuccessResponse<ExerciseApiGetByIdResponse>;
    } catch (error) {
      console.error('Fetch exercise by slug failed:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async update(id: number, dto: UpdateExericseDto, userId: number): Promise<ApiResponse<ExerciseApiUpdateResponse>> {
    const validation = updateExerciseSchema.safeParse(dto);

    if (!validation.success) {
      return errorResponse('Validation failed.', validation.error.flatten().fieldErrors);
    }

    try {
      await this.exerciseRepository.update(id, validation.data, userId);

      return {
        success: true,
        message: 'Exercise updated successfully.',
      } satisfies SuccessResponse<ExerciseApiUpdateResponse>;
    } catch (error) {
      console.error('Update exercise failed:', error);

      if (error instanceof Error && error.message === 'Exercise not found or unauthorized') {
        return errorResponse('Exercise not found or unauthorized.');
      }

      return errorResponse('An error occurred on the server.');
    }
  }
}
