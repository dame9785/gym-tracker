import type { Gender, GoalType } from '@prisma/client';

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
  gender: Gender;
  goalType: GoalType;
}

export type UserSettingsViewModel = UserViewModel;

export interface LoginResponse {
  userId: number;
  token: string;
}

export interface RegisterResponse {
  userId: number;
  token: string;
}

export type UserResponse = UserViewModel;
export type UpdateUserResponse = UserViewModel;
