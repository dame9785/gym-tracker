//Types
import { UpdateExericseDto } from '@/schemas/exercise-schema';
import {
  ApiErrorResponse,
  ApiResponse,
  ExerciseApiDeleteResponse,
  ExerciseApiGetByIdResponse,
  ExerciseApiRegisterResponse,
  ExerciseApiResponse,
  ExerciseApiUpdateResponse,
} from '@/types/api-types';
import type { RegisterExerciseDto } from '@/types/exercise-types';

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
  static async register(dto: RegisterExerciseDto): Promise<ApiResponse<ExerciseApiRegisterResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      const result: ApiResponse<ExerciseApiRegisterResponse> = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
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

  //PUT: Update Exericse
  static async update(id: number, dto: UpdateExericseDto): Promise<ApiResponse<ExerciseApiUpdateResponse>> {
    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });
      const result: ApiResponse<ExerciseApiUpdateResponse> = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
    }
  }

  //GET Exericse by Id
  static async getById(id: string): Promise<ApiResponse<ExerciseApiGetByIdResponse>> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
      });
      const result: ApiResponse<ExerciseApiGetByIdResponse> = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
    }
  }
}
