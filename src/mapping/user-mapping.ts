import { Prisma, type User } from '@prisma/client';

import type { UserSettingsViewModel } from '@/view-models/user-settings-view-model';
import type { RegisterUserDto } from '@/dto/user-dtos';

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
      goalType: {
        connect: {
          id: dto.goalTypeId,
        },
      },
    };
  }
}
