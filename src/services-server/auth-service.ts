import bcrypt from 'bcryptjs';

import { Prisma } from '@prisma/client';
import { UserRepository } from '@/repositories/user-repository';
import { generateToken, verifyToken } from '../lib/jwt';

import { UserSettingsViewModel } from '@/view-models/user-settings-view-model';
import { UserMapper } from '../mapping/user-mapping';

//Types
import type { RegisterUserDto, UpdateUserDto } from '@/dto/user-dtos';
import type { RegisterUserResponse, LoginUserResponse } from '@/responses/user-responses';

export class AuthService {
  private userRepository = new UserRepository();

  //Register
  async register(dto: RegisterUserDto): Promise<RegisterUserResponse> {
    const response: RegisterUserResponse = {
      success: true,
      message: '',
      errors: [],
    };

    const [existingEmail, existingUsername] = await Promise.all([
      this.userRepository.findByEmail(dto.email),
      this.userRepository.findByUsername(dto.username),
    ]);

    if (existingEmail) {
      response.errors.push('E-postadressen existerar redan.');
    }

    if (existingUsername) {
      response.errors.push('Användarnamnet existerar redan.');
    }

    if (response.errors.length > 0) {
      response.success = false;
      response.message = 'Valideringen misslyckades.';
      return response;
    }

    try {
      const passwordHash = await bcrypt.hash(dto.password, 10);
      const userData = UserMapper.userDtoToDbModel(dto, passwordHash);

      const user = await this.userRepository.create(userData);

      response.userToken = generateToken(user.id);
      response.message = 'Användaren registrerades.';

      return response;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target;
          if (Array.isArray(target) && target.includes('email')) {
            response.errors.push('E-postadressen används redan.');
          }
          if (Array.isArray(target) && target.includes('username')) {
            response.errors.push('Användarnamnet används redan.');
          }

          response.success = false;
          response.message = 'Valideringen misslyckades.';
          return response;
        }
      }

      response.success = false;
      response.message = 'Kunde inte skapa användaren.';

      console.error(error);

      return response;
    }
  }

  //Login
  async login(email: string, password: string): Promise<LoginUserResponse> {
    const validationResponse: LoginUserResponse = {
      success: true,
      message: '',
      errors: [],
      userToken: '',
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
