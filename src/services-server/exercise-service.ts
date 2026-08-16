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
  ExerciseApiResponse,
} from '@/types/api-types';

export class ExerciseService {
  private exerciseRepository = new ExerciseRepository();

  async getAllExersise(): Promise<ApiResponse<ExerciseApiResponse>> {
    try {
      const exercises = await this.exerciseRepository.getAll();
      return {
        success: true,
        data: {
          exercises: exercises.map((x) => ExerciseMapper.exerciseModelToViewModel(x)),
        },
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

  async registerExercise(dto: RegisterExerciseDto): Promise<ExerciseResponse> {
    const response: ExerciseResponse = {
      message: '',
      isSuccess: false,
    };

    try {
      await this.exerciseRepository.register(dto);

      response.message = 'Övning sparad';
      response.isSuccess = true;

      return response;
    } catch (error) {
      response.message = 'Något gick fel, övning blev inte skapad';
      return response;
    }
  }

  async getById(id: number): Promise<ExerciseViewModel> {
    try {
      const exericse = await this.exerciseRepository.getById(id);
      if (!exericse) {
        throw new Error('Övning hittades inte');
      }
      const viewModel = ExerciseMapper.exerciseModelToViewModel(exericse);
      return viewModel;
    } catch (error) {
      throw new Error('Något gick fel');
    }
  }

  async update(id: number, dto: RegisterExerciseDto): Promise<ExerciseViewModel> {
    try {
      const updatedExericse = await this.exerciseRepository.update(id, dto);
      if (!updatedExericse) {
        throw new Error('Övning ej uppdaterad');
      }

      const viewModel = ExerciseMapper.exerciseModelToViewModel(updatedExericse);
      return viewModel;
    } catch (error) {
      throw new Error('Något gick fel');
    }
  }
}
