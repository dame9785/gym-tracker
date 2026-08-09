//Next Request & Response
import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUser } from '@/lib/auth';

// Services
import { AuthService } from '@/services-server/auth-service';
import { ApiErrorResponse } from '@/types/api-types';

const authService = new AuthService();

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return {
      success: false,
      message: 'Gick inte hämta token',
    } satisfies ApiErrorResponse;
  }

  const tokenPayLoad = await getAuthenticatedUser(request);
  if (tokenPayLoad === null) {
    return {
      success: false,
      message: 'Gick inte hämta token data',
    } satisfies ApiErrorResponse;
  }

  try {
    const result = await authService.getUserById(tokenPayLoad.userId);
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong, server error',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}
