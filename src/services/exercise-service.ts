//Types
import { ApiErrorResponse, ApiResponse, ExerciseApiDeleteResponse, ExerciseApiResponse } from '@/types/api-types';
import type { RegisterExerciseDto, ExerciseResponse } from '@/types/exercise-types';

//Next Redirect
import { redirect } from 'next/navigation';

const API_URL = 'http://localhost:3000/api/exercises';

export default class ExerciseService {
  //GET: Exericses
  static async getAll(): Promise<ApiResponse<ExerciseApiResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
      });

      const result: ApiResponse<ExerciseApiResponse> = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
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
  static async delete(id: number): Promise<ApiResponse<ExerciseApiDeleteResponse>> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'delete',
      });

      const result: ApiResponse<ExerciseApiDeleteResponse> = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
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
