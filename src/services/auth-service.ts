//DTOS
import type { LoginDto, RegisterUserDto } from '@/dto/user-dtos';

//Types
import type { RegisterUserResponse, LoginUserResponse } from '@/responses/user-responses';
import type { UserFormData, UpdateResult, User } from '@/types/types';

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
      console.log(error);
      throw new Error();
    }
  }

  //Login
  static async login(dto: LoginDto): Promise<LoginUserResponse> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      const data: LoginUserResponse = await response.json();
      return data;
    } catch (error) {
      throw new Error();
    }
  }

  //Register
  static async register(dto: RegisterUserDto): Promise<RegisterUserResponse> {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });
      const data = (await response.json()) as RegisterUserResponse;
      return data;
    } catch (error) {
      throw new Error();
    }
  }

  //Update User
  static async update(userData: UserFormData, userId: number): Promise<UpdateResult> {
    try {
      const response = await fetch(`${API_URL}/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const result = response.json() as Promise<UpdateResult>;
      return result;
    } catch (error) {
      throw new Error();
    }
  }

  static async getUserById(userId: number) {
    try {
      const response = await fetch(`${API_URL}/setting/${userId}`, {
        method: 'GET',
      });
      const result = (await response.json()) as User;
      return result;
    } catch (error) {
      throw new Error();
    }
  }
}
