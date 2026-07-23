import { User } from '@prisma/client';
import { UserSettingsViewModel } from '../../view-models/UserSettingsViewModel';

export class UserMapper {
  static userModelToViewModel(user: User): UserSettingsViewModel {
    return {
      id: user.id,
      email: user.email,
      username: user.username ?? '',
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      phoneNumber: user.phoneNumber,
      passwordHash: user.passwordHash,
      description: user.description,
      bodyWeight: user.bodyWeight,
      goalWeight: user.goalWeight,
      height: user.height,
      gender: user.gender,
      birthDate: user.birthDate,
      goalDate: user.goalDate,
      bodyLenght: user.bodyLenght,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      goalTypeId: user.goalTypeId,
    };
  }
}
