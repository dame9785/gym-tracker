//NEXT JS
import { NextRequest, NextResponse } from 'next/server';

// Services
import { AuthService } from '@/services-server/auth-service';

// Types
import type { ApiErrorResponse } from '@/types/api-types';

//Auth Lib
import { getAuthenticatedUser } from '@/lib/auth';

const authService = new AuthService();

//GET: Current Logged In User
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
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
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
