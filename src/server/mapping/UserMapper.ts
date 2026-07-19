import { User } from '@prisma/client';
import { UserSettingsViewModel } from '../view-models/UserSettingsViewModel';

export class UserMapper {
  static userModelToViewModel(user: User): UserSettingsViewModel {
    return {
      id: user.id,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      username: user.username ?? '',
      email: user.email,
      passwordHash: user.passwordHash,
      description: user.description,
      bodyWeight: user.bodyWeight ?? '',
      height: user.height,
      gender: user.gender,
      birthDate: user.birthDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      goalTypeId: user.goalTypeId,
    };
  }
}
