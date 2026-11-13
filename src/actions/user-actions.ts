'use server';

import { setAuthCookie, clearAuthCookie } from '@/utils/auth-cookie';

import { requireAuth } from '@/lib/auth';
import { loginSchema, registerUserSchema, updateUserSchema, forgotPasswordSchema, resetPasswordSchema, type ChangePasswordDto, type LoginDto, type RegisterUserDto, type UpdateUserDto, type ForgotPasswordDto, type ResetPasswordDto } from '@/schemas/auth-schemas';
import { AuthService } from '@/services/auth-service';
import type { AppActionResult } from '@/types/action-types';
import { ForgotPasswordService } from '@/services/forgot-password-service';
import { PasswordResetService } from '@/services/password-reset-service';
import { getActionErrorMessage, getActionValidationErrors } from '@/utils/action-error';

const authService = new AuthService();
const forgotPasswordService = new ForgotPasswordService();
const passwordResetService = new PasswordResetService();

export async function resetPasswordAction(dto: ResetPasswordDto): Promise<AppActionResult> {
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
    await clearAuthCookie();
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

export async function forgotPasswordAction(dto: ForgotPasswordDto): Promise<AppActionResult> {
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

export async function changePasswordAction(dto: ChangePasswordDto): Promise<AppActionResult> {
  const user = await requireAuth();

  try {
    await authService.changePassword(dto, user.userId);

    await clearAuthCookie();

    return {
      success: true,
      message: 'Password changed successfully. Please log in again.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

export async function updateUserAction(dto: UpdateUserDto): Promise<AppActionResult<{ userId: number }>> {
  const user = await requireAuth();

  const validation = updateUserSchema.safeParse(dto);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
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
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

export async function registerUserAction(dto: RegisterUserDto): Promise<AppActionResult<{ userId: number }>> {
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

    await setAuthCookie(response.token);

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
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

export async function logoutAction(): Promise<AppActionResult> {
  await clearAuthCookie();

  return {
    success: true,
    message: 'Logged out successfully.',
  };
}

export async function loginUserAction(dto: LoginDto): Promise<AppActionResult<{ userId: number }>> {
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

    await setAuthCookie(response.token);

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
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}
