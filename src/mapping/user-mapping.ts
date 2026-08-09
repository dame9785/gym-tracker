//Prisma
import { Prisma } from '@prisma/client';

//Types
import type { UserSettingsViewModel, UserViewModel } from '@/types/user-types';
import type { UpdateUserDto, RegisterUserDto } from '@/schemas/auth-schemas';

import type { User } from '@prisma/client';

export class UserMapper {
  static userModelToUserSettingsViewModel(user: User): UserSettingsViewModel {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      bodyWeight: user.bodyWeight.toNumber(),
      height: user.height.toNumber(),
      goalWeight: user.goalWeight.toNumber(),
      birthDate: user.birthDate.toISOString(),
      goalDate: user.goalDate.toISOString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      goalTypeId: user.goalTypeId ?? null,
      gender: user.gender,
    };
  }

  static userDbToViewModel(user: User): UserViewModel {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      bodyWeight: user.bodyWeight.toNumber(),
      height: user.height.toNumber(),
      goalWeight: user.goalWeight.toNumber(),
      birthDate: user.birthDate.toISOString(),
      goalDate: user.goalDate.toISOString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      goalTypeId: user.goalTypeId ?? null,
      gender: user.gender,
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
      bodyWeight: new Prisma.Decimal(dto.bodyWeight),
      height: new Prisma.Decimal(dto.height),
      birthDate: new Date(dto.birthDate),
      goalWeight: new Prisma.Decimal(dto.goalWeight),
      goalDate: new Date(dto.goalDate),
      goalType: {
        connect: {
          id: dto.goalTypeId,
        },
      },
    };
  }
}
