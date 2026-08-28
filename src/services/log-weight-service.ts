// Schemas
import { AddWeightDto, UpdateWeightDto } from '@/schemas/weight-log.schemas';
import { ApiResponse, DeleteLogWeightResponse, LogWeightResponse, UserLogWeightResponse } from '@/types/api-types';
import { errorResponse } from '@/utils/api-error';

const API_URL = 'http://localhost:3000/api/log-weight';

export default class LogWeightService {
  //GET: /api/weight-logs
  static async getAll(userToken: string, page: number): Promise<ApiResponse<UserLogWeightResponse>> {
    try {
      const response = await fetch(`${API_URL}?page=${page}`, {
        method: 'GET',
        headers: {
          Cookie: `token=${userToken}`,
        },
      });

      const result = (await response.json()) as ApiResponse<UserLogWeightResponse>;
      return result;
    } catch (error) {
      console.error('Could not connect to server:', error);

      return errorResponse('Could not connect to the server.');
    }
  }

  //DELETE: /api/weight-logs
  static async delete(id: number, userToken: string): Promise<ApiResponse<DeleteLogWeightResponse>> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          Cookie: `token=${userToken}`,
        },
      });

      const result = (await response.json()) as ApiResponse<DeleteLogWeightResponse>;
      return result;
    } catch (error) {
      console.error('Could not connect to server:', error);

      return errorResponse('Could not connect to the server.');
    }
  }

  //POST: /api/weight-logs
  static async create(dto: AddWeightDto, userToken: string): Promise<ApiResponse<LogWeightResponse>> {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `token=${userToken}`,
        },
        body: JSON.stringify(dto),
      });

      const result = (await response.json()) as ApiResponse<LogWeightResponse>;
      return result;
    } catch (error) {
      console.error('Could not connect to server:', error);

      return errorResponse('Could not connect to the server.');
    }
  }

  //PUT: /api/weight-logs/ID
  static async update(weightId: number, dto: UpdateWeightDto, userToken: string): Promise<ApiResponse<LogWeightResponse>> {
    try {
      const response = await fetch(`${API_URL}/${weightId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `token=${userToken}`,
        },
        body: JSON.stringify(dto),
      });

      const result = (await response.json()) as ApiResponse<LogWeightResponse>;
      return result;
    } catch (error) {
      console.error('Could not connect to server:', error);

      return errorResponse('Could not connect to the server.');
    }
  }

  //GET: /api/weight-logs/ID
  static async getById(id: string, userToken: string): Promise<ApiResponse<LogWeightResponse>> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
          Cookie: `token=${userToken}`,
        },
      });

      const result = (await response.json()) as ApiResponse<LogWeightResponse>;
      return result;
    } catch (error) {
      console.error('Could not connect to server:', error);

      return errorResponse('Could not connect to the server.');
    }
  }
}
