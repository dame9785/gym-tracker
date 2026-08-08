// Prisma
import { Prisma } from '@prisma/client';

// Repository
import { UserRepository } from '@/repositories/user-repository';

// JWT Library
import { generateToken } from '@/lib/jwt';

// Password hashing
import bcrypt from 'bcryptjs';

//Mapping
import { UserMapper } from '../mapping/user-mapping';

//Helpers
import FieldErrorsMessagesHelper from '@/helpers/field-error-helper';

//Types
import type { AuthApiResponse, UserSettingsViewModel } from '@/types/user-types';
import type { RegisterUserDto, UpdateUserDto } from '@/schemas/auth-schemas';

export class AuthService {
  private userRepository = new UserRepository();

  // Register User
  async register(dto: RegisterUserDto): Promise<AuthApiResponse> {
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
        errors: Object.values(fieldErrors),
        fieldErrors,
      };
    }

    try {
      const passwordHash = await bcrypt.hash(dto.password, 10);
      const userData = UserMapper.createUserDtoToDbModel(dto, passwordHash);
      const user = await this.userRepository.create(userData);

      return {
        success: true,
        message: 'Användaren registrerades.',
        errors: [],
        userToken: generateToken(user.id),
      };
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const fieldErrors = FieldErrorsMessagesHelper.getUniqueConstraintFieldErrors<RegisterUserDto>(error);

        return {
          success: false,
          message: 'Valideringen misslyckades.',
          errors: Object.values(fieldErrors),
          fieldErrors,
        };
      }

      return {
        success: false,
        message: 'Kunde inte skapa användaren.',
        errors: [],
      };
    }
  }

  //Get User By Id
  async getUserById(id: number): Promise<AuthApiResponse> {
    const user = await this.userRepository.findById(id);
    if (user === null) {
      return {
        success: false,
        message: 'Kunde inte hitta användare',
        errors: ['Kunde inte hitta användare.'],
      };
    }

    // User -> ViewModel
    const viewModel: UserSettingsViewModel = UserMapper.userModelToViewModel(user);
    return {
      success: true,
      message: 'Lyckades hämta användare',
      UserSettingsViewModel: viewModel,
    };
  }

  // Update User
  async updateUser(dto: UpdateUserDto, userId: number): Promise<AuthApiResponse> {
    const fieldErrors: Partial<Record<keyof UpdateUserDto, string>> = {};

    // Check whether email or username already belongs
    // to another user.
    const [existingEmail, existingUsername] = await Promise.all([
      this.userRepository.emailExists(dto.email, userId),
      this.userRepository.usernameExists(dto.username, userId),
    ]);

    //Check if Email Already existing
    if (existingEmail) {
      fieldErrors.email = 'E-postadressen är upptagen.';
    }

    //Check if UserName Already existing
    if (existingUsername) {
      fieldErrors.username = 'Användarnamnet är upptaget.';
    }
    if (existingEmail || existingUsername) {
      return {
        success: false,
        message: 'Valideringen misslyckades.',
        errors: Object.values(fieldErrors),
        fieldErrors,
      };
    }

    try {
      //Mapping DTO To DB-Model
      const updateData = UserMapper.userDtoToDbModel(dto);
      await this.userRepository.update(userId, updateData);
      return {
        success: true,
        message: 'Användaren uppdaterades.',
        errors: [],
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const errors: string[] = [];
        const fieldErrors: Partial<Record<keyof UpdateUserDto, string>> = {};

        const target = error.meta?.target;

        if (Array.isArray(target) && target.includes('email')) {
          errors.push('E-postadressen används redan.');
          fieldErrors.email = 'E-postadressen används redan.';
        }

        if (Array.isArray(target) && target.includes('username')) {
          errors.push('Användarnamnet används redan.');
          fieldErrors.username = 'Användarnamnet används redan.';
        }

        return {
          success: false,
          message: 'Användare lyckades inte uppdateras.',
          errors: Object.values(fieldErrors),
          fieldErrors,
        };
      }

      return {
        success: false,
        message: 'Användare lyckades inte uppdateras.',
        errors: Object.values(fieldErrors),
        fieldErrors,
      };
    }
  }
}
