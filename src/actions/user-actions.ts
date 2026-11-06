'use server';

import { cookies } from 'next/headers';

import { requireAuth } from '@/lib/auth';
import {
  loginSchema,
  registerUserSchema,
  updateUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type ChangePasswordDto,
  type LoginDto,
  type RegisterUserDto,
  type UpdateUserDto,
  type ForgotPasswordDto,
  type ResetPasswordDto,
} from '@/schemas/auth-schemas';
import { AuthService } from '@/services/auth-service';
import type { UserActionResult } from '@/types/user-types';
import { ForgotPasswordService } from '@/services/forgot-password-service';
import { PasswordResetService } from '@/services/password-reset-service';

const authService = new AuthService();
const forgotPasswordService = new ForgotPasswordService();
const passwordResetService = new PasswordResetService();

function getErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Something went wrong.';
  }

  if (
    error.message.startsWith('Validation failed: ') ||
    error.message.startsWith('Registration failed: ') ||
    error.message.startsWith('User update failed: ') ||
    error.message.startsWith('User already exists: ')
  ) {
    return 'Please correct the highlighted fields.';
  }

  if (error.message === 'Invalid email or password.') {
    return 'Invalid email or password.';
  }

  if (error.message === 'User not found.') {
    return 'User not found.';
  }

  console.error('[UserAction] Unexpected error:', error);

  return 'Something went wrong.';
}

function getValidationErrors(error: unknown): Record<string, string[]> | undefined {
  if (!(error instanceof Error)) {
    return undefined;
  }

  const prefixes = ['Validation failed: ', 'Registration failed: ', 'User update failed: ', 'User already exists: '];
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

export async function resetPasswordAction(dto: ResetPasswordDto): Promise<UserActionResult<undefined>> {
  const validation = resetPasswordSchema.safeParse(dto);

  if (!validation.success) {
    return {
      success: false,
      message: 'Please correct the highlighted fields.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    await passwordResetService.resetPassword(validation.data.token, validation.data.newPassword);

    return {
      success: true,
      message: 'Your password has been reset successfully.',
      data: undefined,
    };
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Invalid or expired password reset link.') {
      return {
        success: false,
        message: 'This password reset link is invalid or has expired.',
      };
    }

    console.error('[resetPasswordAction] Failed:', error);

    return {
      success: false,
      message: 'Unable to reset your password. Please try again later.',
    };
  }
}

export async function forgotPasswordAction(dto: ForgotPasswordDto): Promise<UserActionResult<undefined>> {
  const validation = forgotPasswordSchema.safeParse(dto);

  if (!validation.success) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    await forgotPasswordService.requestPasswordReset(validation.data.email);

    return {
      success: true,
      message: 'If an account exists with that email address, you will receive a password reset link shortly.',
      data: undefined,
    };
  } catch (error: unknown) {
    console.error('[forgotPasswordAction] Failed:', error);

    return {
      success: false,
      message: 'Unable to process your request. Please try again later.',
    };
  }
}

export async function changePasswordAction(dto: ChangePasswordDto): Promise<UserActionResult<undefined>> {
  try {
    const user = await requireAuth();

    await authService.changePassword(dto, user.userId);

    return {
      success: true,
      message: 'Password changed successfully.',
      data: undefined,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error),
      errors: getValidationErrors(error),
    };
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
    console.error('[loginUserAction] Login failed:', error);
    return {
      success: false,
      message: getErrorMessage(error),
      errors: getValidationErrors(error),
    };
  }
}
