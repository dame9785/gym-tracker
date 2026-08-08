import { NextResponse, NextRequest } from 'next/server';
import { AuthApiResponse } from '@/types/user-types';
import { getAuthenticatedUser } from '@/lib/auth';
import { updateSchema } from '@/schemas/auth-schemas';
import authService from '@/services/auth-service';

static async update(
  userData: UpdateUserDto,
  userId: number,
): Promise<ApiResponse<UserSettingsViewModel>> {
  try {
    const response = await fetch(
      `/api/auth/update/${userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      },
    );

    const data: ApiResponse<UserSettingsViewModel> =
      await response.json();

    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Ett oväntat fel inträffade.',
    };
  }
}
