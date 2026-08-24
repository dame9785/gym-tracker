//Repository
import { ExerciseRepository } from '../repositories/exercise-repository';

//Types
import type { ExerciseResponse, ExerciseViewModel, RegisterExerciseDto } from '@/types/exercise-types';

//Mapper
import { ExerciseMapper } from '@/mapping/exericse-mapping';
import {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
  ExerciseApiDeleteResponse,
  ExerciseApiGetByIdResponse,
  ExerciseApiRegisterResponse,
  ExerciseApiResponse,
  ExerciseApiUpdateResponse,
} from '@/types/api-types';
import { registerExerciseSchema, RegisterExericseDto } from '@/schemas/exercise-schema';
import { ErrorsHelper } from '@/helpers/error-helper';

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
      return {
        success: false,
        message: 'Server fel, gick inte hämta övningar',
      } satisfies ApiErrorResponse;
    }
  }

  async delete(id: number): Promise<ApiResponse<ExerciseApiDeleteResponse>> {
    try {
      await this.exerciseRepository.delete(id);
      return {
        success: true,
        message: 'Övning borttagen',
        data: {
          success: true,
          message: 'Övning borttagen',
        },
      } satisfies ApiSuccessResponse<ExerciseApiDeleteResponse>;
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'Server fel, gick ej ta bort övning',
      } satisfies ApiErrorResponse;
    }
  }

  async registerExercise(dto: RegisterExericseDto): Promise<ApiResponse<ExerciseApiRegisterResponse>> {
    const validation = registerExerciseSchema.safeParse(dto);

    if (!validation.success) {
      const fieldErrors = ErrorsHelper.getFormErrors<ExerciseApiRegisterResponse>(validation.error.issues);
      const errors = Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message]]));

      return {
        success: false,
        message: 'Felaktig email eller lösenord.',
        errors: errors,
      } satisfies ApiErrorResponse;
    }

    try {
      const exericse = await this.exerciseRepository.register(dto);
      return {
        success: true,
        message: 'Övning skapad',
        data: ExerciseMapper.exerciseModelToViewModel(exericse),
      } satisfies ApiSuccessResponse<ExerciseApiRegisterResponse>;
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'Server fel, gick ej ta bort övning',
      } satisfies ApiErrorResponse;
    }
  }

  async getById(id: number): Promise<ApiResponse<ExerciseApiGetByIdResponse>> {
    try {
      const exericse = await this.exerciseRepository.getById(id);
      if (!exericse) {
        throw new Error('Övning hittades inte');
      }

      return {
        success: true,
        message: 'Övning lyckades hämta',
        data: ExerciseMapper.exerciseModelToViewModel(exericse),
      } satisfies ApiSuccessResponse<ExerciseApiGetByIdResponse>;
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'Server fel, gick ej ta bort övning',
      } satisfies ApiErrorResponse;
    }
  }

  async update(id: number, dto: RegisterExerciseDto): Promise<ApiResponse<ExerciseApiUpdateResponse>> {
    const validation = registerExerciseSchema.safeParse(dto);

    if (!validation.success) {
      const fieldErrors = ErrorsHelper.getFormErrors<ExerciseApiRegisterResponse>(validation.error.issues);
      const errors = Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message]]));

      return {
        success: false,
        message: 'Felaktig email eller lösenord.',
        errors: errors,
      } satisfies ApiErrorResponse;
    }

    try {
      const updatedExericse = await this.exerciseRepository.update(id, dto);
      return {
        success: true,
        message: 'Övning uppdaterad!',
        data: ExerciseMapper.exerciseModelToViewModel(updatedExericse),
      } satisfies ApiSuccessResponse<ExerciseApiUpdateResponse>;
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'Server fel, gick ej ta bort övning',
      } satisfies ApiErrorResponse;
    }
  }
}
