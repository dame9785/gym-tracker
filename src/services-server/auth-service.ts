//Prisma
import { Prisma } from '@prisma/client';

//Repository
import { UserRepository } from '@/repositories/user-repository';

//JWT Libary
import { generateToken, verifyToken } from '../lib/jwt';
import bcrypt from 'bcryptjs';

//Mapping
import { UserMapper } from '../mapping/user-mapping';

//Types
import type { AuthApiResponse, UserSettingsViewModel } from '@/types/user-types';
import type { RegisterUserDto, LoginDto, UpdateUserDto } from '@/schemas/auth-schemas';
import { LogViewModel } from '@/types/log-weight-types';

export class AuthService {
  private userRepository = new UserRepository();

  //Register
  async register(dto: RegisterUserDto): Promise<AuthApiResponse> {
    const errors: string[] = [];
    const fieldErrors: Partial<Record<keyof RegisterUserDto, string>> = {};

    const [existingEmail, existingUsername] = await Promise.all([this.userRepository.emailExists(dto.email), this.userRepository.usernameExists(dto.username)]);

    if (existingEmail) {
      errors.push('E-postadressen används redan.');
      fieldErrors.email = 'E-postadressen används redan.';
    }

    if (existingUsername) {
      errors.push('Användarnamnet används redan.');
      fieldErrors.username = 'Användarnamnet används redan.';
    }

    if (errors.length > 0) {
      return {
        success: false,
        message: 'Valideringen misslyckades.',
        errors,
        fieldErrors,
      };
    }

    try {
      const passwordHash = await bcrypt.hash(dto.password, 10);
      const userData = UserMapper.userDtoToDbModel(dto, passwordHash);

      const user = await this.userRepository.create(userData);

      return {
        success: true,
        message: 'Användaren registrerades.',
        errors: [],
        userToken: generateToken(user.id),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const errors: string[] = [];
        const fieldErrors: Partial<Record<keyof RegisterUserDto, string>> = {};
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
          message: 'Valideringen misslyckades.',
          errors,
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

  //Login
  async login(dto: LoginDto): Promise<AuthApiResponse> {
    try {
      const user = await this.userRepository.findByEmail(dto.email);

      if (!user) {
        return {
          success: false,
          message: 'Valideringen misslyckades.',
          errors: ['Finns ingen användare med den angivna e-postadressen.'],
          fieldErrors: {
            email: 'E-postadressen existerar inte.',
          },
        };
      }

      //Check if password match with password
      const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
      if (!passwordMatch) {
        return {
          success: false,
          message: 'Valideringen misslyckades.',
          errors: ['Lösenordet är fel.'],
          fieldErrors: {
            password: 'Lösenordet är fel.',
          },
        };
      }

      return {
        success: true,
        message: 'Login successful.',
        errors: [],
        userToken: generateToken(user.id),
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Kunde inte logga in.',
        errors: [],
      };
    }
  }

  //Get Current User
  async getCurrentUser(token: string) {
    try {
      const payload = verifyToken(token) as {
        userId: number;
      };
      const user = await this.userRepository.findById(payload.userId);
      if (!user) {
        throw new Error('User not found.');
      }
      return user;
    } catch (error) {
      return null;
    }
  }

  //Get User By Id
  async getUserById(id: number): Promise<UserSettingsViewModel> {
    const user = await this.userRepository.findById(id);

    // User -> ViewModel
    const viewModel: UserSettingsViewModel = UserMapper.userModelToViewModel(user);
    return viewModel;
  }

  //Update User
  async updateUser(dto: UpdateUserDto, userId: number): Promise<AuthApiResponse> {
    const fieldErrors: Partial<Record<keyof UpdateUserDto, string>> = {};

    //Check if email & username already existing
    const [existingEmail, existingUsername] = await Promise.all([
      this.userRepository.emailExists(dto.email, userId),
      this.userRepository.usernameExists(dto.username, userId),
    ]);

    if (existingEmail) {
      fieldErrors.email = 'E-postadressen är upptagen.';
    }

    if (existingUsername) {
      fieldErrors.username = 'Användarnamnet är upptagen.';
    }

    if (existingEmail || existingUsername) {
      return {
        success: false,
        message: 'Valideringen misslyckades.',
        errors: [],
        fieldErrors,
      };
    }

    try {
      const updateData = {
        email: dto.email,
        username: dto.username,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phoneNumber: dto.phoneNumber,
        bodyWeight: dto.bodyWeight,
        bodyLength: dto.bodyLenght,
        birthDate: new Date(dto.birthDate),
        goalWeight: dto.goalWeight,
        goalDate: new Date(dto.goalDate),
        goalType: {
          connect: {
            id: dto.goalTypeId,
          },
        },
      };
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
          message: 'Valideringen misslyckades.',
          errors,
          fieldErrors,
        };
      }

      return {
        success: false,
        message: 'Kunde inte uppdatera användaren.',
        errors: [],
      };
    }
  }
}
