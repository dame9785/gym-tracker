import { NextRequest, NextResponse } from 'next/server';

// Services
import { AuthService } from '@/services-server/auth-service';

// Types
import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/api-types';
import type { UserSettingsViewModel } from '@/types/user-types';

const authService = new AuthService();

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;

    const user = await authService.getUserById(Number(userId));

    if (!user) {
      const response: ApiErrorResponse = {
        success: false,
        message: 'Användaren hittades inte.',
      };

      return NextResponse.json(response, {
        status: 404,
      });
    }

    const response: ApiSuccessResponse<UserSettingsViewModel> = {
      success: true,
      data: user,
      message: 'Lyckades hämta användare.',
    };

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error('GET /api/auth/setting/[userId] failed:', error);

    const response: ApiErrorResponse = {
      success: false,
      message: 'Kunde inte hämta användaren.',
    };

    return NextResponse.json(response, {
      status: 500,
    });
  }
}
