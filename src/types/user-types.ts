//Gender Enum
import { Gender, GoalType } from '@prisma/client';

export interface UserSettingsViewModel {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bodyWeight: number;
  height: number;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
  goalWeight: number;
  goalDate: string;
  gender: Gender;
  goalType: GoalType;
}

export interface UserViewModel {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bodyWeight: number;
  height: number;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
  goalWeight: number;
  goalDate: string;
  goalType: GoalType;
  gender: Gender;
}

export interface LoginResponse {
  userId: number;
  token: string;
}

export type UserResponse = UserViewModel;

export interface RegisterResponse {
  userId: number;
  token: string;
}

export type UpdateUserResponse = UserViewModel;

export type UserActionResult<T = undefined> =
  | {
      success: true;
      message: string;
      data: T;
    }
  | {
      success: false;
      message: string;
      errors?: Record<string, string[]>;
    };
