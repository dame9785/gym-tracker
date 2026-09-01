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
  ApiResponse,
  ErrorResponse,
  LoginResponse,
  RegisterResponse,
  SuccessResponse,
  UpdateUserResponse,
  UserResponse,
} from '@/types/api-types';
import {
  loginSchema,
  registerUserSchema,
  updateUserSchema,
  type LoginDto,
  type RegisterUserDto,
  type UpdateUserDto,
} from '@/schemas/auth-schemas';
import { errorResponse } from '@/utils/api-error';
import { UserViewModel } from '@/types/user-types';

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
        } satisfies ErrorResponse;
      }

      if (!user) {
        return {
          success: false,
          message: 'Felaktig email eller lösenord.',
        } satisfies ErrorResponse;
      }

      //Check if password match
      const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
      if (!passwordValid) {
        return {
          success: false,
          message: 'Felaktig email eller lösenord.',
        } satisfies ErrorResponse;
      }

      //If errors existing
      if (Object.keys(errors).length > 0) {
        const validationResult: ErrorResponse = {
          success: false,
          message: 'Kontrollera formuläret.',
          errors,
        };

        return validationResult;
      }

      //Generate token
      const token = generateToken(user.id);
      console.log(token);

      return {
        success: true,
        message: 'Inloggning lyckades',
        data: {
          token: token,
          userId: user.id,
        },
      } satisfies SuccessResponse<LoginResponse>;
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

    if (existingUsername || existingEmail) {
      return {
        success: false,
        message: 'Användare eller e-postadress används redan.',
        errors: Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message]])),
      } satisfies ErrorResponse;
    }

    //Validation
    const validation = registerUserSchema.safeParse(dto);
    if (!validation.success) {
      const fieldErrors = ErrorsHelper.getFormErrors<RegisterUserDto>(validation.error.issues);
      const errors = Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message]]));

      return {
        success: false,
        message: 'Felaktig email eller lösenord.',
        errors: errors,
      } satisfies ErrorResponse;
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
      } satisfies SuccessResponse<RegisterResponse>;
    } catch (error) {
      console.error('AuthService.register failed:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const fieldErrors = ErrorsHelper.getUniqueConstraintFieldErrors<RegisterUserDto>(error);

        return {
          success: false,
          message: 'Valideringen misslyckades.',
          errors: Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message]])),
        };
      }

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
      return { success: false, message: 'Gick inte hämta användaren' } satisfies ErrorResponse;
    }

    const userViewModel = UserMapper.userDbToViewModel(user);
    return {
      success: true,
      data: userViewModel,
    } satisfies SuccessResponse<UserResponse>;
  }

  // Update User
  // Update User
  async updateUser(dto: UpdateUserDto, userId: number): Promise<ApiResponse<UserViewModel>> {
    // Validation
    const validation = updateUserSchema.safeParse(dto);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;

      return errorResponse('Validation failed', errors);
    }

    // Använd validerad data efter Zod-valideringen
    const data = validation.data;

    // Kontrollera om email eller username redan används
    const [existingEmail, existingUsername] = await Promise.all([
      this.userRepository.emailExists(data.email, userId),
      this.userRepository.usernameExists(data.username, userId),
    ]);

    const fieldErrors: Record<string, string> = {};

    if (existingEmail) {
      fieldErrors.email = 'E-postadressen är upptagen.';
    }

    if (existingUsername) {
      fieldErrors.username = 'Användarnamnet är upptaget.';
    }

    if (existingEmail || existingUsername) {
      return {
        success: false,
        message: 'Användare eller e-postadress används redan.',
        errors: Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message]])),
      } satisfies ErrorResponse;
    }

    try {
      const updateData = UserMapper.userDtoToDbModel(data);

      await this.userRepository.update(userId, updateData);

      const updatedUser = await this.userRepository.findById(userId);

      if (!updatedUser) {
        return {
          success: false,
          message: 'Användaren kunde inte hittas.',
        } satisfies ErrorResponse;
      }

      return {
        success: true,
        message: 'Användaren uppdaterades.',
        data: UserMapper.userDbToViewModel(updatedUser),
      } satisfies SuccessResponse<UpdateUserResponse>;
    } catch (error) {
      console.error('AuthService.updateUser failed:', error);

      return {
        success: false,
        message: 'Användaren kunde inte uppdateras.',
      } satisfies ErrorResponse;
    }
  }
}
