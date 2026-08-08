//Prisma
import { Prisma } from '@prisma/client';

//Types
import type { UserSettingsViewModel } from '@/types/user-types';
import type { UpdateUserDto, RegisterUserDto } from '@/schemas/auth-schemas';

import type { User } from '@prisma/client';

export class UserMapper {
  static userModelToViewModel(user: User): UserSettingsViewModel {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      bodyWeight: user.bodyWeight,
      goalWeight: user.goalWeight,
      height: user.height,
      gender: user.gender,
      birthDate: user.birthDate,
      goalDate: user.goalDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      goalTypeId: user.goalTypeId,
    };
  }

  static createUserDtoToDbModel(dto: RegisterUserDto, passwordHash: string): Prisma.UserCreateInput {
    return {
      email: dto.email,
      username: dto.username,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phoneNumber: dto.phoneNumber,
      bodyWeight: new Prisma.Decimal(dto.bodyWeight),
      height: new Prisma.Decimal(dto.height),
      goalWeight: new Prisma.Decimal(dto.goalWeight),
      gender: dto.gender,
      birthDate: new Date(dto.birthDate),
      goalDate: new Date(dto.goalDate),
      passwordHash,
      goalType: {
        connect: {
          id: dto.goalTypeId,
        },
      },
    };
  }

  static userDtoToDbModel(dto: UpdateUserDto): Prisma.UserUpdateInput {
    return {
      email: dto.email,
      username: dto.username,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phoneNumber: dto.phoneNumber,
      bodyWeight: dto.bodyWeight,
      height: dto.height,
      birthDate: new Date(dto.birthDate),
      goalWeight: dto.goalWeight,
      goalDate: new Date(dto.goalDate),
      goalType: {
        connect: {
          id: dto.goalTypeId,
        },
      },
    };
  }
}
