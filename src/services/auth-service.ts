import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { UserRepository } from '@/repositories/user-repository';
import { generateToken } from '@/lib/jwt';
import { UserMapper } from '@/mapping/user-mapping';
import { ErrorsHelper } from '@/helpers/error-helper';
import { loginSchema, registerUserSchema, updateUserSchema, type LoginDto, type RegisterUserDto, type UpdateUserDto } from '@/schemas/auth-schemas';
import type { LoginResponse, RegisterResponse, UpdateUserResponse, UserResponse } from '@/types/user-types';

export class AuthService {
  private readonly userRepository: UserRepository = new UserRepository();

  /**
   * Authenticates a user and returns a JWT.
   * Throws an error if validation or authentication fails.
   */
  async login(dto: LoginDto): Promise<LoginResponse> {
    const validation = loginSchema.safeParse(dto);

    if (!validation.success) {
      const fieldErrors = ErrorsHelper.getFormErrors<LoginDto>(validation.error.issues);

      throw new Error(`Validation failed: ${JSON.stringify(fieldErrors)}`);
    }

    const { email, password } = validation.data;
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      throw new Error('Invalid email or password.');
    }

    return {
      token: generateToken(user.id),
      userId: user.id,
    };
  }

  /**
   * Registers a new user and returns their ID and JWT.
   * Throws an error if validation fails or the account already exists.
   */
  async register(dto: RegisterUserDto): Promise<RegisterResponse> {
    const validation = registerUserSchema.safeParse(dto);

    if (!validation.success) {
      const fieldErrors = ErrorsHelper.getFormErrors<RegisterUserDto>(validation.error.issues);

      throw new Error(`Validation failed: ${JSON.stringify(fieldErrors)}`);
    }

    const data = validation.data;

    const [existingEmail, existingUsername] = await Promise.all([this.userRepository.emailExists(data.email), this.userRepository.usernameExists(data.username)]);

    const fieldErrors: Partial<Record<keyof RegisterUserDto, string>> = {};

    if (existingEmail) {
      fieldErrors.email = 'E-postadressen används redan.';
    }

    if (existingUsername) {
      fieldErrors.username = 'Användarnamnet används redan.';
    }

    if (existingEmail || existingUsername) {
      throw new Error(`User already exists: ${JSON.stringify(fieldErrors)}`);
    }

    try {
      const passwordHash = await bcrypt.hash(data.password, 10);
      const userData = UserMapper.createUserDtoToDbModel(data, passwordHash);

      const user = await this.userRepository.create(userData);

      return {
        userId: user.id,
        token: generateToken(user.id),
      };
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const fieldErrors = ErrorsHelper.getUniqueConstraintFieldErrors<RegisterUserDto>(error);

        throw new Error(`User already exists: ${JSON.stringify(fieldErrors)}`);
      }

      throw error;
    }
  }

  /**
   * Returns a user by ID.
   * Throws an error if the user does not exist.
   */
  async getUserById(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error('User not found.');
    }

    return UserMapper.userDbToViewModel(user);
  }

  /**
   * Updates a user's profile and returns the updated user.
   * Throws an error if validation or updating fails.
   */
  async updateUser(dto: UpdateUserDto, userId: number): Promise<UpdateUserResponse> {
    const validation = updateUserSchema.safeParse(dto);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;

      throw new Error(`Validation failed: ${JSON.stringify(fieldErrors)}`);
    }

    const data = validation.data;

    const [existingEmail, existingUsername] = await Promise.all([
      this.userRepository.emailExists(data.email, userId),
      this.userRepository.usernameExists(data.username, userId),
    ]);

    const fieldErrors: Partial<Record<keyof UpdateUserDto, string>> = {};

    if (existingEmail) {
      fieldErrors.email = 'E-postadressen är upptagen.';
    }

    if (existingUsername) {
      fieldErrors.username = 'Användarnamnet är upptaget.';
    }

    if (existingEmail || existingUsername) {
      throw new Error(`User already exists: ${JSON.stringify(fieldErrors)}`);
    }

    const updateData = UserMapper.userDtoToDbModel(data);

    await this.userRepository.update(userId, updateData);

    const updatedUser = await this.userRepository.findById(userId);

    if (!updatedUser) {
      throw new Error('User not found after update.');
    }

    return UserMapper.userDbToViewModel(updatedUser);
  }
}
