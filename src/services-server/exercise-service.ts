//Repository
import { ExerciseRepository } from '../repositories/exercise-repository';

//Types
import type { RegisterExerciseDto } from '@/types/exercise-types';

//Mapper
import { ExerciseMapper } from '@/mapping/exericse-mapping';
import {
  ApiResponse,
  ApiSuccessResponse,
  ExerciseApiDeleteResponse,
  ExerciseApiGetByIdResponse,
  ExerciseApiRegisterResponse,
  ExerciseApiResponse,
  ExerciseApiUpdateResponse,
} from '@/types/api-types';
import { registerExerciseSchema, RegisterExericseDto } from '@/schemas/exercise-schema';
import { errorResponse } from '@/utils/api-error';

export class ExerciseService {
  private exerciseRepository = new ExerciseRepository();

  async getAllExersise(): Promise<ApiResponse<ExerciseApiResponse>> {
    try {
      const exercises = await this.exerciseRepository.getAll();
      return {
        success: true,
        data: exercises.map((x) => ExerciseMapper.exerciseModelToViewModel(x)),
      };
    } catch (error) {
      console.error('Get all exericsces failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async delete(id: number): Promise<ApiResponse<ExerciseApiDeleteResponse>> {
    try {
      await this.exerciseRepository.delete(id);
      return {
        success: true,
        message: 'Exericse deleted successfully',
        data: {
          success: true,
          message: 'Exericse deleted successfully',
        },
      } satisfies ApiSuccessResponse<ExerciseApiDeleteResponse>;
    } catch (error) {
      console.error('Delete exericse failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async registerExercise(dto: RegisterExericseDto): Promise<ApiResponse<ExerciseApiRegisterResponse>> {
    const validation = registerExerciseSchema.safeParse(dto);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return errorResponse('Validation failed', errors);
    }

    try {
      const exericse = await this.exerciseRepository.register(dto);
      return {
        success: true,
        message: 'Exericse created successfully.',
        data: ExerciseMapper.exerciseModelToViewModel(exericse),
      } satisfies ApiSuccessResponse<ExerciseApiRegisterResponse>;
    } catch (error) {
      console.error('Create exericse failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async getById(id: number): Promise<ApiResponse<ExerciseApiGetByIdResponse>> {
    try {
      const exericse = await this.exerciseRepository.getById(id);
      if (!exericse) {
        return errorResponse('Could not find exericse log.');
      }

      return {
        success: true,
        message: 'Exericse fetched successfully.',
        data: ExerciseMapper.exerciseModelToViewModel(exericse),
      } satisfies ApiSuccessResponse<ExerciseApiGetByIdResponse>;
    } catch (error) {
      console.error('Fetch exericse by id failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }

  async update(id: number, dto: RegisterExerciseDto): Promise<ApiResponse<ExerciseApiUpdateResponse>> {
    const validation = registerExerciseSchema.safeParse(dto);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return errorResponse('Validation failed', errors);
    }

    try {
      const updatedExericse = await this.exerciseRepository.update(id, dto);
      return {
        success: true,
        message: 'Exericse updated successfully.',
        data: ExerciseMapper.exerciseModelToViewModel(updatedExericse),
      } satisfies ApiSuccessResponse<ExerciseApiUpdateResponse>;
    } catch (error) {
      console.error('fetch exericse by id failed, server error:', error);
      return errorResponse('An error occurred on the server.');
    }
  }
}
