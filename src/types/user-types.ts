//Gender Enum
import { Gender } from '@prisma/client';

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
  goalTypeId: number | null;
  gender: Gender;
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
  goalTypeId: number | null;
  gender: Gender;
}
