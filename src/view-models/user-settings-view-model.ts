import { Gender } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/client';

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
