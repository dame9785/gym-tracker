//NEXT Redirect
import { redirect } from 'next/navigation';

//Types
import type { AuthApiResponse, User } from '@/types/user-types';
import { RegisterUserDto, LoginDto, UpdateUserDto } from '@/schemas/auth-schemas';
import { ApiResponse, LoginResponse } from '@/types/api-types';
import { UserSettingsViewModel } from '@/types/user-types';

//API URL
const API_URL = 'http://localhost:3000/api/auth';

export default class AuthService {
  //Me
  static async me(token: string): Promise<AuthApiResponse> {
    try {
      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
          Cookie: `token=${token}`,
        },
        cache: 'no-store',
      });

      const apiResponse: AuthApiResponse = await response.json();
      return apiResponse;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      return {
        message,
        success: false,
      };
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

      const data: ApiResponse<LoginResponse> = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Kunde inte kontakta servern.',
      };
    }
  }

  //Register
  static async register(dto: RegisterUserDto): Promise<AuthApiResponse> {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      const data: AuthApiResponse = await response.json();
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
  static async logout(): Promise<AuthApiResponse> {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
      });

      const result: AuthApiResponse = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }
}
