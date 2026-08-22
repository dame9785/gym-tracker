// Schemas
import { AddWeightDto, EditWeightDto } from '@/schemas/weight-log.schemas';
import { ApiResponse, DeleteLogWeightResponse, LogWeightResponse, UserLogWeightResponse } from '@/types/api-types';
import { errorResponse } from '@/utils/api-responses';

const API_URL = 'http://localhost:3000/api/log-weight';

export class LogWeightService {
  static async getAll(userId: number): Promise<ApiResponse<UserLogWeightResponse>> {
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'GET',
      });

      const result: ApiResponse<UserLogWeightResponse> = await response.json();

      return result;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }

  static async delete(id: number): Promise<ApiResponse<DeleteLogWeightResponse>> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        return errorResponse('Gick inte hämta data');
      }

      const result: ApiResponse<DeleteLogWeightResponse> = await response.json();
      return result;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }

  static async create(dto: AddWeightDto, userId: number): Promise<ApiResponse<LogWeightResponse>> {
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        return errorResponse('Gick inte hämta data');
      }

      const result: ApiResponse<LogWeightResponse> = await response.json();
      return result;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }

  static async update(weightId: string, dto: EditWeightDto) {
    try {
      const response = await fetch(`${API_URL}/${weightId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        return errorResponse('Gick inte hämta data');
      }

      const result: ApiResponse<LogWeightResponse> = await response.json();
      return result;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }

  static async getById(id: string): Promise<ApiResponse<LogWeightResponse>> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        return errorResponse('Gick inte hämta data');
      }

      const result: ApiResponse<LogWeightResponse> = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      return errorResponse('Gick inte hämta data');
    }
  }
}
