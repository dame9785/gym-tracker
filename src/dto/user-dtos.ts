import { Gender } from '@prisma/client';

export interface RegisterUserDto {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bodyWeight: number;
  bodyLenght: number;
  gender: Gender;
  birthDate: Date;
  goalTypeId: number;
  goalWeight: number;
  goalDate: string;
  password: string;
  passwordhash: string | null;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateUserDto {
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
