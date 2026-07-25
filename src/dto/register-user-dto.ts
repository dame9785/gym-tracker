import { Gender } from '@prisma/client';

export default interface RegisterUserDto {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bodyWeight: number;
  bodyLenght: number;
  gender: Gender;
  birthDate: string;
  goalTypeId: number;
  goalWeight: number;
  goalDate: string;
  password: string;
}
