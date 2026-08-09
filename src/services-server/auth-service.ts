// Prisma
import { Prisma } from '@prisma/client';

// Repository
import { UserRepository } from '@/repositories/user-repository';

// JWT
import { generateToken } from '@/lib/jwt';

// Password hashing
import bcrypt from 'bcryptjs';

// Mapping
import { UserMapper } from '../mapping/user-mapping';

// Helpers
import { ErrorsHelper } from '@/helpers/error-helper';

// Types
import type { ApiResponse, LoginResponse, RegisterResponse } from '@/types/api-types';
import type { LoginDto, RegisterUserDto, UpdateUserDto } from '@/schemas/auth-schemas';
import { UserSettingsViewModel } from '@/types/user-types';
import { UpdateUserResult } from '@/types/service-result-types';

export class AuthService {
  private userRepository = new UserRepository();

  //Login User
  async login(dto: LoginDto): Promise<ApiResponse<LoginResponse>> {
    try {
      const user = await this.userRepository.findByEmail(dto.email);

      if (!user) {
        return {
          success: false,
          message: 'E-postadressen eller lösenordet är felaktigt.',
        };
      }

      const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);

      if (!passwordValid) {
        return {
          success: false,
          message: 'E-postadressen eller lösenordet är felaktigt.',
        };
      }

      return {
        success: true,
        message: 'Användaren är inloggad.',
        data: {
          userId: user.id,
          token: generateToken(user.id),
        },
      };
    } catch (error) {
      console.error('AuthService.login failed:', error);

      return {
        success: false,
        message: 'Ett internt serverfel inträffade.',
      };
    }
  }

  // Register User
  async register(dto: RegisterUserDto): Promise<ApiResponse<RegisterResponse>> {
    const fieldErrors: Partial<Record<keyof RegisterUserDto, string>> = {};

    const [existingEmail, existingUsername] = await Promise.all([
      this.userRepository.emailExists(dto.email),
      this.userRepository.usernameExists(dto.username),
    ]);

    if (existingEmail) {
      fieldErrors.email = 'E-postadressen används redan.';
    }

    if (existingUsername) {
      fieldErrors.username = 'Användarnamnet används redan.';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        message: 'Valideringen misslyckades.',
        errors: Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message]])),
      };
    }

    try {
      const passwordHash = await bcrypt.hash(dto.password, 10);

      const userData = UserMapper.createUserDtoToDbModel(dto, passwordHash);

      const user = await this.userRepository.create(userData);

      return {
        success: true,
        message: 'Användaren registrerades.',
        data: {
          userId: user.id,
          token: generateToken(user.id),
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const fieldErrors = ErrorsHelper.getUniqueConstraintFieldErrors<RegisterUserDto>(error);

        return {
          success: false,
          message: 'Valideringen misslyckades.',
          errors: Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message]])),
        };
      }

      console.error('AuthService.register failed:', error);

      return {
        success: false,
        message: 'Kunde inte skapa användaren.',
      };
    }
  }

  //Get User By Id
  async getUserById(id: number): Promise<ApiResponse<UserSettingsViewModel>> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return {
        success: false,
        message: 'Användaren hittades inte.',
      };
    }

    const viewModel = UserMapper.userModelToViewModel(user);

    return {
      success: true,
      data: viewModel,
    };
  }

  // Update User
  async updateUser(dto: UpdateUserDto, userId: number): Promise<ApiResponse<UserSettingsViewModel>> {
    const fieldErrors: Partial<Record<keyof UpdateUserDto, string>> = {};

    const [existingEmail, existingUsername] = await Promise.all([
      this.userRepository.emailExists(dto.email, userId),
      this.userRepository.usernameExists(dto.username, userId),
    ]);

    if (existingEmail) {
      fieldErrors.email = 'E-postadressen är upptagen.';
    }

    if (existingUsername) {
      fieldErrors.username = 'Användarnamnet är upptaget.';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        message: 'Valideringen misslyckades.',
        errors: Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message]])),
      };
    }

    try {
      const updateData = UserMapper.userDtoToDbModel(dto);

      await this.userRepository.update(userId, updateData);

      const updatedUser = await this.userRepository.findById(userId);

      if (!updatedUser) {
        return {
          success: false,
          message: 'Användaren hittades inte.',
        };
      }

      return {
        success: true,
        data: UserMapper.userModelToViewModel(updatedUser),
        message: 'Användaren uppdaterades.',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const fieldErrors = ErrorsHelper.getUniqueConstraintFieldErrors<UpdateUserDto>(error);

        return {
          success: false,
          message: 'Användaren kunde inte uppdateras.',
          errors: Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message]])),
        };
      }

      console.error('AuthService.updateUser failed:', error);

      return {
        success: false,
        message: 'Användaren kunde inte uppdateras.',
      };
    }
  }
}
