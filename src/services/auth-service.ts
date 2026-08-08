//NEXT Redirect
import { redirect } from 'next/navigation';

//Types
import type { User, AuthApiResponse } from '@/types/user-types';
import { RegisterUserDto, LoginDto, UpdateUserDto } from '@/schemas/auth-schemas';

//API URL
const API_URL = '/api/auth';

export default class AuthService {
  //Me
  static async me(token: string) {
    try {
      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }

  //Login
  static async login(dto: LoginDto): Promise<AuthApiResponse> {
    try {
      const response = await fetch(`${API_URL}/login`, {
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

  //Update User
  static async update(userData: UpdateUserDto, userId: number): Promise<AuthApiResponse> {
    try {
      const response = await fetch(`${API_URL}/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data: AuthApiResponse = await response.json();
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }

  //GET: User By Id
 static async getUserById(
  userId: number
): Promise<UserSettingsViewModel> {
  const response = await fetch(`${API_URL}/setting/${userId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Kunde inte hämta användaren.');
  }

  const result: UserSettingsViewModel = await response.json();

  return result;
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
