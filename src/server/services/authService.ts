import bcrypt from 'bcryptjs';

import { Prisma, User } from '@prisma/client';
import { UserRepository } from '@/server/repositories/user-repository';
import { generateToken, verifyToken } from '../../lib/jwt';
import { RegisterUserDto } from '@/server/dto/register-user-dto';
import { UserValidationResponse } from '@/server/responses/user-validation-response';
import { id } from 'zod/locales';
import { UserSettingViewModel } from '@/server/view-models/UserSettingsViewModel';
import { UserMapper } from '../mapping/UserMapper';

export class AuthService {
  private userRepository = new UserRepository();

  //Register
  async register(data: RegisterUserDto): Promise<UserValidationResponse> {
    const validationResponse: UserValidationResponse = {
      success: true,
      message: '',
      errors: [],
    };

    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      validationResponse.success = false;
      validationResponse.message = 'Valideringen misslyckades.';
      validationResponse.errors.push('E-postadressen existerar redan.');
    }

    const existingUsername = await this.userRepository.findByUsername(data.username);
    if (existingUsername) {
      validationResponse.success = false;
      validationResponse.message = 'Valideringen misslyckades.';
      validationResponse.errors.push('Användarnamnet existerar redan.');
    }

    if (!validationResponse.success) {
      return validationResponse;
    }

    try {
      const passwordHash = await bcrypt.hash(data.password, 10);
      const user = await this.userRepository.create({
        username: data.username,
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        bodyWeight: data.weight,
        height: data.height,
        gender: data.gender,
        birthDate: new Date(data.birthDate),
        goalType: {
          connect: {
            id: data.goalTypeId,
          },
        },
      });

      validationResponse.userToken = generateToken(user.id);
      validationResponse.message = 'Användaren registrerades.';
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target;
          if (Array.isArray(target) && target.includes('email')) {
            validationResponse.errors.push('E-postadressen används redan.');
          }
          if (Array.isArray(target) && target.includes('username')) {
            validationResponse.errors.push('Användarnamnet används redan.');
          }

          validationResponse.success = false;
          validationResponse.message = 'Valideringen misslyckades.';
          return validationResponse;
        }
      }
      validationResponse.success = false;
      validationResponse.message = 'Kunde inte skapa användaren.';
      return validationResponse;
    }
    return validationResponse;
  }

  //Login
  async login(email: string, password: string): Promise<UserValidationResponse> {
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
  async getCurrentUser(token: string) {
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
  async getUserById(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found.');
    }

    // User -> ViewModel
    const viewModel: UserSettingViewModel = UserMapper.userModelToViewModel(user);
    return viewModel;
  }
}
