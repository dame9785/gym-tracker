//Gender Enum
import { Gender, GoalType } from '@prisma/client';

export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bodyWeight: number;
  height: number;
  goalTypeId: number;
  gender: Gender;
  birthDate: string;
  goalWeight: number;
  goalDate: string;
}

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
