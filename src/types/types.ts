//Gender Enum
import { Gender } from '@prisma/client';

export interface UpdateUserFormProps {
  userId: string;
}

export interface GoalType {
  id: number;
  title: string;
}

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

export interface UserFormData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bodyWeight: number;
  bodyLenght: number;
  birthDate: string;
  goalWeight: number;
  goalDate: string;
  goalTypeId: number;
}

export interface UpdateResult {
  errors: string[];
  message: string;
  success: boolean;
}
