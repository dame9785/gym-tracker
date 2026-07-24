import { ExerciseRepository } from '../repositories/exercise-repository';
import { ExerciseViewModel } from '../view-models/excercise-view-model';

export class ExerciseService {
  private exerciseRepository = new ExerciseRepository();

  async getAllExersise(): Promise<ExerciseViewModel[]> {
    const exercises = await this.exerciseRepository.getAll();

    return exercises.map((exercise) => {
      return {
        id: exercise.id,
        name: exercise.name,
      };
    });
  }
}
