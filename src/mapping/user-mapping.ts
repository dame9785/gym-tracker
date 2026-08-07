//Prisma
import { Prisma } from '@prisma/client';

//Types
import type { UserSettingsViewModel } from '@/types/user-types';
import type { RegisterUserDto } from '@/schemas/auth-schemas';

import type { User } from '@prisma/client';

export class UserMapper {
  static userModelToViewModel(user: User): UserSettingsViewModel {
    return {
      id: user.id,
      email: user.email,
      username: user.username ?? '',
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      phoneNumber: user.phoneNumber,
      bodyWeight: user.bodyWeight,
      goalWeight: user.goalWeight,
      bodyLenght: user.bodyLength,
      gender: user.gender,
      birthDate: user.birthDate,
      goalDate: user.goalDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      goalTypeId: user.goalTypeId,
    };
  }
  static userDtoToDbModel(dto: RegisterUserDto, passwordHash: string): Prisma.UserCreateInput {
    return {
      username: dto.username,
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      bodyWeight: dto.bodyWeight,
      bodyLength: dto.bodyLenght,
      gender: dto.gender,
      birthDate: new Date(dto.birthDate),
      goalDate: new Date(dto.goalDate),
      goalType: {
        connect: {
          id: dto.goalTypeId,
        },
      },
    };
  }
}
