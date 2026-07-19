import { Gender } from '@prisma/client';

export interface UpdateUserDto {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  weight: number;
  height: number;
  gender: Gender;
  birthDate: string;
  goalTypeId: number;
  goalWeight: number;
  goalDate: string;
  password: string;
}
