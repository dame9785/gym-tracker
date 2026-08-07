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
  bodyLenght: number;
  goalTypeId: number;
  gender: Gender;
  birthDate: string;
  goalWeight: number;
  goalDate: string;
}

export interface UserSettingsViewModel {
  id: number;
  firstName: string | null;
  lastName: string | null;
  username: string;
  email: string;
  bodyWeight: Decimal | null;
  bodyLenght: Decimal | null;
  goalWeight: Decimal | null;
  phoneNumber: string | null;
  gender: Gender | null;
  birthDate: Date | null;
  goalDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  goalTypeId: number | null;
}

export interface AuthApiResponse {
  message: string;
  success: boolean;
  errors: string[];
  userToken?: string;
  fieldErrors?: Record<string, string>;
}
