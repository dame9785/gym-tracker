import RegisterExerciseDto from '@/dto/register-exercise.dto';
import ExerciseResponse from '@/responses/exercise-response';
import ExerciseViewModel from '@/view-models/excercise-view-model';

export default class ExerciseService {
  //GET: Exericses
  static async getAll(): Promise<ExerciseViewModel[]> {
    try {
      const response = await fetch('/api/exercises', {
        method: 'GET',
      });
      const data = response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  //POST: Register Exericse
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

  //DELETE: Exericse by id
  static async delete(id: number) {
    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: 'delete',
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Gick inte radera',
      };
    }
  }

  //PUT: Edit Exericse
  static async edit(id: string, dto: RegisterExerciseDto) {
    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) {
        throw Error('Gick inte uppdatera övning');
      }
      return response.json();
    } catch (error) {
      throw new Error();
    }
  }

  //GET Exericse by Id
  static async getById(id: string) {
    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: 'GET',
      });
      return await response.json();
    } catch (error) {
      throw new Error('Gick inte hämta');
    }
  }
}
