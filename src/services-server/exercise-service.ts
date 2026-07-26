import { ExerciseRepository } from '../repositories/exercise-repository';
import ExerciseViewModel from '../view-models/excercise-view-model';
import ExerciseResponse from '@/responses/exercise-response';
import RegisterExerciseDto from '@/dto/register-exercise.dto';
import { ExerciseMapper } from '@/mapping/exericse-mapping';

export class ExerciseService {
  private exerciseRepository = new ExerciseRepository();

  async getAllExersise(): Promise<ExerciseViewModel[]> {
    try {
      const exercises = await this.exerciseRepository.getAll();
      return exercises.map((exercise) => {
        return {
          id: exercise.id,
          name: exercise.name,
          muscleGroup: exercise.muscleGroup,
          equipment: exercise.equipment,
        };
      });
    } catch (error) {
      throw new Error('Något gick fel');
    }
  }

  async delete(id: number) {
    const response: ExerciseResponse = {
      message: '',
      success: false,
    };

    try {
      await this.exerciseRepository.delete(id);
      response.message = 'Övning sparad';
      response.success = true;
      return response;
    } catch (error) {
      response.message = 'Något gick fel, övning blev inte skapad';
      return response;
    }
  }

  async registerExercise(dto: RegisterExerciseDto): Promise<ExerciseResponse> {
    const response: ExerciseResponse = {
      message: '',
      success: false,
    };

    try {
      await this.exerciseRepository.register(dto);

      response.message = 'Övning sparad';
      response.success = true;

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
