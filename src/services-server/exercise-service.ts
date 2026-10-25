//Repository
import { ExerciseRepository } from '../repositories/exercise-repository';

//Mapper
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
        data: exercises.map((x) => ExerciseMapper.exerciseModelToViewModel(x)),
      };
    } catch (error) {
      console.error('Get all exericsces failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async delete(id: number, userId: number): Promise<ApiResponse<ExerciseApiDeleteResponse>> {
    try {
      await this.exerciseRepository.delete(id, userId);
      return {
        success: true,
        message: 'Exericse deleted successfully',
        data: {
          success: true,
          message: 'Exericse deleted successfully',
        },
      } satisfies SuccessResponse<ExerciseApiDeleteResponse>;
    } catch (error) {
      console.error('Delete exericse failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async registerExercise(dto: RegisterExericseDto, userId: number): Promise<ApiResponse<ExerciseApiRegisterResponse>> {
    const validation = registerExerciseSchema.safeParse(dto);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;

      return errorResponse('Validation failed', errors);
    }

    try {
      const exercise = await this.exerciseRepository.register(validation.data, userId);

      return {
        success: true,
        message: 'Exercise created successfully.',
        data: ExerciseMapper.exerciseModelToViewModel(exercise),
      } satisfies SuccessResponse<ExerciseApiRegisterResponse>;
    } catch (error) {
      console.error('Create exercise failed, server error:', error);

      return errorResponse('An error occurred on the server.');
    }
  }

  async getById(id: number, userId: number): Promise<ApiResponse<ExerciseApiGetByIdResponse>> {
    try {
      const exericse = await this.exerciseRepository.getById(id, userId);
      if (!exericse) {
        return errorResponse('Could not find exericse log.');
      }

      return {
        success: true,
        message: 'Exericse fetched successfully.',
        data: ExerciseMapper.exerciseModelToViewModel(exericse),
      } satisfies SuccessResponse<ExerciseApiGetByIdResponse>;
    } catch (error) {
      console.error('Fetch exericse by id failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async update(id: number, dto: UpdateExericseDto, userId: number): Promise<ApiResponse<void>> {
    const validation = updateExerciseSchema.safeParse(dto);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return errorResponse('Validation failed', errors);
    }

    try {
      const result = await this.exerciseRepository.update(id, validation.data, userId);

      if (result.count === 0) {
        return errorResponse('Exercise not found or unauthorized.');
      }

      return {
        success: true,
        message: 'Exercise updated successfully.',
      } satisfies SuccessResponse<ExerciseApiUpdateResponse>;
    } catch (error) {
      console.error('Update exercise failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }
}
