import RegisterExerciseDto from '@/dto/register-exercise.dto';
import ExerciseResponse from '@/responses/exercise-response';

export default class ExerciseService {
  static async register(dto: RegisterExerciseDto): Promise<ExerciseResponse> {
    try {
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      // API:t returnerar alltid ett ExerciseResponse
      const result: ExerciseResponse = await response.json();

      // Om servern svarade med t.ex. 400 eller 500
      if (!response.ok) {
        return result;
      }

      return result;
    } catch {
      // Endast om fetch misslyckas, t.ex. servern är nere
      return {
        success: false,
        message: 'Kunde inte ansluta till servern.',
      };
    }
  }
}
