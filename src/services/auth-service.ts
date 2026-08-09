//NEXT Redirect
import { redirect } from 'next/navigation';

//Types
import { RegisterUserDto, LoginDto, UpdateUserDto } from '@/schemas/auth-schemas';
import {
  ApiErrorResponse,
  ApiResponse,
  LogoutResponse,
  LoginResponse,
  RegisterResponse,
  UserResponse,
} from '@/types/api-types';
import { UserSettingsViewModel } from '@/types/user-types';

//API URL
const API_URL = 'http://localhost:3000/api/auth';

export default class AuthService {
  //Me
  static async me(token: string): Promise<ApiResponse<UserResponse>> {
    try {
      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
          Cookie: `token=${token}`,
        },
        cache: 'no-store',
      });

      const apiResponse: ApiResponse<UserResponse> = await response.json();
      return apiResponse;
    } catch (error) {
      return {
        message: 'Server fel',
        success: false,
      } satisfies ApiErrorResponse;
    }
  }

  //Login
  static async login(dto: LoginDto): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      const result: ApiResponse<LoginResponse> = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte ansluta till servern',
      } satisfies ApiErrorResponse;
    }
  }

  //Register
  static async register(dto: RegisterUserDto): Promise<ApiResponse<RegisterResponse>> {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      const data: ApiResponse<RegisterResponse> = await response.json();
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }

  static async update(userData: UpdateUserDto, userId: number): Promise<ApiResponse<UserSettingsViewModel>> {
    try {
      const response = await fetch(`/api/auth/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data: ApiResponse<UserSettingsViewModel> = await response.json();

      return data;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Ett oväntat fel inträffade.',
      };
    }
  }

  //GET: User By Id
  static async getUserById(userId: number): Promise<ApiResponse<UserSettingsViewModel>> {
    try {
      const response = await fetch(`/api/auth/setting/${userId}`, {
        method: 'GET',
      });

      const data: ApiResponse<UserSettingsViewModel> = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Ett oväntat fel inträffade.',
      };
    }
  }
  //Logout
  static async logout(): Promise<ApiResponse<LogoutResponse>> {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
      });

      const result: ApiResponse<LogoutResponse> = await response.json();
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }
}
