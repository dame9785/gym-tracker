//Gender Enum
import { Gender } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

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
  bodyWeight: Decimal;
  height: Decimal;
  birthDate: Date;
  createdAt: Date;
  updatedAt: Date;
  goalWeight: Decimal;
  goalDate: Date;
  goalTypeId: number | null;
  gender: Gender;
}

export interface AuthApiResponse {
  message: string;
  success: boolean;
  errors?: string[];
  userToken?: string;
  fieldErrors?: Record<string, string>;
  UserSettingsViewModel?: UserSettingsViewModel;
}
