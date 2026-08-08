//Next Request & Response
import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUser } from '@/lib/auth';
import { AuthApiResponse } from '@/types/user-types';

// Services
import { AuthService } from '@/services-server/auth-service';

const authService = new AuthService();

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unauthorized',
        errors: [],
      } satisfies AuthApiResponse,
      { status: 401 },
    );
  }

  const tokenPayLoad = await getAuthenticatedUser(request);
  if (tokenPayLoad === null) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unauthorized',
        errors: [],
      } satisfies AuthApiResponse,
      { status: 401 },
    );
  }

  try {
    const apiResponse = await authService.getCurrentUser(tokenPayLoad.userId);

    if (apiResponse.UserSettingsViewModel == null) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
          errors: [],
        } satisfies AuthApiResponse,
        { status: 401 },
      );
    }

    return NextResponse.json(apiResponse, {
      status: apiResponse.success ? 200 : 401,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong, server error',
        errors: [],
      } satisfies AuthApiResponse,
      { status: 500 },
    );
  }
}
