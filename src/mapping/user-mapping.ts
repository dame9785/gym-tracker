import { User } from '@prisma/client';
import { UserSettingsViewModel } from '@/view-models/user-settings-view-model';

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
}
