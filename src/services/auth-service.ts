import bcrypt from 'bcryptjs';

import { Prisma } from '@prisma/client';
import { UserRepository } from '@/repositories/user-repository';
import { generateToken, verifyToken } from '../lib/jwt';
import { RegisterUserDto } from '@/dto/register-user-dto';
import { UserValidationResponse } from '@/responses/user-validation-response';
import { UserSettingsViewModel } from '@/view-models/user-settings-view-model';
import { UserMapper } from '@/mapping/user-mapping';
import { UpdateUserDto } from '@/dto/update-user-dto';

export default class AuthService {
  private userRepository = new UserRepository();

  //Login
  static async login(email: string, password: string): Promise<UserValidationResponse> {
    const validationResponse: UserValidationResponse = {
      success: true,
      message: '',
      errors: [],
    };

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      validationResponse.success = false;
      validationResponse.message = 'Valideringen misslyckades.';
      validationResponse.errors.push('E-postadressen existerar inte.');
      return validationResponse;
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      validationResponse.success = false;
      validationResponse.message = 'Valideringen misslyckades.';
      validationResponse.errors.push('Lösenordet är fel.');
      return validationResponse;
    }

    const token = generateToken(user.id);
    validationResponse.userToken = token;
    return validationResponse;
  }

  //Get Current User
  static async getCurrentUser(token: string) {
    const payload = verifyToken(token) as {
      userId: number;
    };

    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }

  //Get User By Id
  static async getUserById(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found.');
    }

    // User -> ViewModel
    const viewModel: UserSettingsViewModel = UserMapper.userModelToViewModel(user);
    return viewModel;
  }

  //Update User
  async updateUser(dto: UpdateUserDto, userId: number): Promise<UserValidationResponse> {
    const validationResponse: UserValidationResponse = {
      success: true,
      message: '',
      errors: [],
    };

    const existingEmail = await this.userRepository.emailExists(dto.email, userId);
    if (existingEmail) {
      validationResponse.success = false;
      validationResponse.message = 'Validation failed';
      validationResponse.errors.push('E-postadressen finns redan registrerad');
    }

    const usernameExists = await this.userRepository.userNameAlreadyExist(dto.username, userId);
    if (usernameExists) {
      validationResponse.success = false;
      validationResponse.message = 'Validation failed';
      validationResponse.errors.push('Användarnamnet finns redan registrerad');
    }

    if (!validationResponse.success) {
      return validationResponse;
    }

    const updateData = {
      email: dto.email,
      username: dto.username,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phoneNumber: dto.phoneNumber,
      bodyWeight: dto.bodyWeight,
      bodyLenght: dto.bodyLenght,
      birthDate: new Date(dto.birthDate),
      goalWeight: dto.goalWeight,
      goalDate: new Date(dto.goalDate),
      goalType: {
        connect: {
          id: dto.goalTypeId,
        },
      },
    };

    try {
      await this.userRepository.update(userId, updateData);
    } catch (error) {
      console.error(error);
      validationResponse.success = false;
      validationResponse.message = 'Update failed';
      validationResponse.errors.push('Något gick fel.');
    }

    return validationResponse;
  }
}
