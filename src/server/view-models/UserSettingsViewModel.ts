import { Gender, GoalType } from '@prisma/client';

export interface UserSettingsViewModel {
  id: number;
  firstName: string | null;
  lastName: string | null;
  username: string;
  email: string;
  passwordHash: string;
  description: string | null;
  bodyWeight: Decimal | null;
  height: Decimal | null;
  gender: Gender | null;
  birthDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  goalTypeId: number | null;
}
