'use server';

import { requireAuth } from '@/lib/auth';
import {
  LoginDto,
  loginSchema,
  RegisterUserDto,
  registerUserSchema,
  UpdateUserDto,
  updateUserSchema,
} from '@/schemas/auth-schemas';
import { AuthService } from '@/services-server/auth-service';
import { cookies } from 'next/headers';
import { success } from 'zod';

const authService = new AuthService();

export async function updateUserAction(dto: UpdateUserDto) {
  const user = await requireAuth();

  const validation = updateUserSchema.safeParse(dto);
  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  return authService.updateUser(validation.data, user.userId);
}

export async function registerUserAction(dto: RegisterUserDto) {
  const validation = registerUserSchema.safeParse(dto);
  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  return authService.register(validation.data);
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete('token');
  return {
    success: true,
    message: 'Cookie delete',
  };
}

export async function loginUserAction(dto: LoginDto) {
  const validation = loginSchema.safeParse(dto);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const response = await authService.login(validation.data);

  if (!response.success) {
    return response;
  }

  const cookieStore = await cookies();
  if (!response.data) {
    return {
      success: false,
      message: response.message,
    };
  }

  cookieStore.set('token', response.data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return {
    success: true,
    message: response.message,
    data: {
      userId: response.data.userId,
    },
  };
}
