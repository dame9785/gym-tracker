//Types
import type { RegisterExerciseDto, ExerciseResponse, ExerciseViewModel } from '@/types/exercise-types';

//Next Redirect
import { redirect } from 'next/navigation';

export default class ExerciseService {
  //GET: Exericses
  static async getAll(): Promise<ExerciseViewModel[]> {
    try {
      const response = await fetch('/api/exercises', {
        method: 'GET',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
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
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
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
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
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
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
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
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }
}
