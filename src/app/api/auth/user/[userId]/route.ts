import { NextRequest, NextResponse } from 'next/server';

// Services
import { AuthService } from '@/services-server/auth-service';

// Types
import type { ApiErrorResponse } from '@/types/api-types';

const authService = new AuthService();

//PUT: UPDATE USER
export async function PUT(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const response = await authService.updateUser(body, Number(userId));

    return NextResponse.json(response, {
      status: response.success ? 200 : 404,
    });
  } catch (error) {
    console.error('PUT /api/auth/user/[userId] failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong, server error',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}
