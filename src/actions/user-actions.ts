'use server';

import { cookies } from 'next/headers';

import { requireAuth } from '@/lib/auth';
import { loginSchema, registerUserSchema, updateUserSchema, type LoginDto, type RegisterUserDto, type UpdateUserDto } from '@/schemas/auth-schemas';
import { AuthService } from '@/services-server/auth-service';
import type { UserActionResult } from '@/types/user-types';

const authService = new AuthService();

function getErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Something went wrong.';
  }

  if (error.message.startsWith('Validation failed: ')) {
    return 'Validation failed.';
  }

  if (error.message.startsWith('User already exists: ')) {
    return 'The username or email address is already in use.';
  }

  if (error.message === 'Invalid email or password.') {
    return 'Invalid email or password.';
  }

  if (error.message === 'User not found.') {
    return 'User not found.';
  }

  return 'Something went wrong.';
}

function getValidationErrors(error: unknown): Record<string, string[]> | undefined {
  if (!(error instanceof Error)) {
    return undefined;
  }

  const prefixes = ['Validation failed: ', 'User already exists: '];
  const prefix = prefixes.find((item) => error.message.startsWith(item));

  if (!prefix) {
    return undefined;
  }

  try {
    const parsed: unknown = JSON.parse(error.message.slice(prefix.length));

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return undefined;
    }

    const errors: Record<string, string[]> = {};

    for (const [field, value] of Object.entries(parsed)) {
      if (typeof value === 'string') {
        errors[field] = [value];
      } else if (Array.isArray(value)) {
        const messages = value.filter((item): item is string => typeof item === 'string');

        if (messages.length > 0) {
          errors[field] = messages;
        }
      }
    }

    return Object.keys(errors).length > 0 ? errors : undefined;
  } catch {
    return undefined;
  }
}

export async function updateUserAction(dto: UpdateUserDto): Promise<UserActionResult<{ userId: number }>> {
  try {
    const user = await requireAuth();

    const validation = updateUserSchema.safeParse(dto);

    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const updatedUser = await authService.updateUser(validation.data, user.userId);

    return {
      success: true,
      message: 'User updated successfully.',
      data: {
        userId: updatedUser.id,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
      errors: getValidationErrors(error),
    };
  }
}

export async function registerUserAction(dto: RegisterUserDto): Promise<UserActionResult<{ userId: number }>> {
  const validation = registerUserSchema.safeParse(dto);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await authService.register(validation.data);
    const cookieStore = await cookies();

    cookieStore.set('token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      message: 'Registration successful.',
      data: {
        userId: response.userId,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
      errors: getValidationErrors(error),
    };
  }
}

export async function logoutAction(): Promise<{
  success: true;
  message: string;
}> {
  const cookieStore = await cookies();

  cookieStore.delete('token');

  return {
    success: true,
    message: 'Logged out successfully.',
  };
}

export async function loginUserAction(dto: LoginDto): Promise<UserActionResult<{ userId: number }>> {
  const validation = loginSchema.safeParse(dto);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await authService.login(validation.data);
    const cookieStore = await cookies();

    cookieStore.set('token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      message: 'Login successful.',
      data: {
        userId: response.userId,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
      errors: getValidationErrors(error),
    };
  }
}
