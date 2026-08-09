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
import type {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
  LoginResponse,
  RegisterResponse,
  UserResponse,
} from '@/types/api-types';
import { loginSchema, type LoginDto, type RegisterUserDto, type UpdateUserDto } from '@/schemas/auth-schemas';
import { UserSettingsViewModel } from '@/types/user-types';

export class AuthService {
  private userRepository = new UserRepository();

  //Login User
  async login(dto: LoginDto): Promise<ApiResponse<LoginResponse>> {
    try {
      const user = await this.userRepository.findByEmail(dto.email);
      const errors: Record<string, string[]> = {};

      //ZOD Validation
      const validation = loginSchema.safeParse(dto);

      if (!validation.success) {
        const fieldErrors = ErrorsHelper.getFormErrors<LoginDto>(validation.error.issues);
        const errors = Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message]]));

        return {
          success: false,
          message: 'Validerings fel',
          errors: errors,
        } satisfies ApiErrorResponse;
      }

      if (!user) {
        return {
          success: false,
          message: 'Felaktig email eller lösenord.',
        } satisfies ApiErrorResponse;
      }

      //Check if password match
      const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
      if (!passwordValid) {
        return {
          success: false,
          message: 'Felaktig email eller lösenord.',
        } satisfies ApiErrorResponse;
      }

      //If errors existing
      if (Object.keys(errors).length > 0) {
        const validationResult: ApiErrorResponse = {
          success: false,
          message: 'Kontrollera formuläret.',
          errors,
        };

        return validationResult;
      }

      //Generate token
      const token = generateToken(user.id);

      return {
        success: true,
        message: 'Inloggning lyckades',
        data: {
          token: token,
          userId: user.id,
        },
      } satisfies ApiSuccessResponse<LoginResponse>;
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
  async getUserById(id: number): Promise<ApiResponse<UserResponse>> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return { success: false, message: 'Gick inte hämta användaren' } satisfies ApiErrorResponse;
    }

    const userViewModel = UserMapper.userDbToViewModel(user);
    return {
      success: true,
      data: {
        user: userViewModel,
      },
    } satisfies ApiSuccessResponse<UserResponse>;
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
        data: UserMapper.userModelToUserSettingsViewModel(updatedUser),
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
