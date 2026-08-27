//Types
import { RegisterUserDto, LoginDto, UpdateUserDto } from '@/schemas/auth-schemas';
import { ApiResponse, LogoutResponse, LoginResponse, RegisterResponse, UserResponse, UpdateUserResponse } from '@/types/api-types';

//Utils
import { errorResponse } from '@/utils/api-error';

//API URL
const API_URL = 'http://localhost:3000/api/auth';

export default class AuthService {
  //GET: Current logged in user
  static async getCurrentUser(token: string): Promise<ApiResponse<UserResponse>> {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        headers: {
          Cookie: `token=${token}`,
        },
        cache: 'no-store',
      });

      const result = (await response.json()) as ApiResponse<UserResponse>;
      return result;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }

  //Login
  static async login(dto: LoginDto): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      const result = (await response.json()) as ApiResponse<LoginResponse>;
      return result;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }

  //Register
  static async register(dto: RegisterUserDto): Promise<ApiResponse<RegisterResponse>> {
    try {
      const response = await fetch(`${API_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      const result = (await response.json()) as ApiResponse<RegisterResponse>;
      return result;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }

  static async update(dto: UpdateUserDto, userId: number): Promise<ApiResponse<UpdateUserResponse>> {
    try {
      const response = await fetch(`${API_URL}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      const result = (await response.json()) as ApiResponse<UpdateUserResponse>;
      return result;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }

  //Logout
  static async logout(): Promise<ApiResponse<LogoutResponse>> {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
      });

      const result = (await response.json()) as ApiResponse<LogoutResponse>;
      return result;
    } catch (error) {
      return errorResponse('Gick inte hämta data');
    }
  }
}
