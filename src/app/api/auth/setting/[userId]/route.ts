import { NextRequest, NextResponse } from 'next/server';

// Services
import { AuthService } from '@/services-server/auth-service';

// Types
import type { User } from '@/types/user-types';
import type { ApiResponse } from '@/types/api-types';

const authService = new AuthService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    const user = await authService.getUserById(Number(userId));

    if (!user) {
      const response: ApiResponse<User> = {
        success: false,
        message: 'Användaren hittades inte.',
      };

      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<User> = {
      success: true,
      data: user,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(
      'GET /api/auth/setting/[userId] failed:',
      error,
    );

    const response: ApiResponse<User> = {
      success: false,
      message: 'Kunde inte hämta användaren.',
    };

    return NextResponse.json(response, { status: 500 });
  }
}