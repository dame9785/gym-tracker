import { NextResponse } from 'next/server';

// Services
import { AuthService } from '@/services-server/auth-service';
import { ApiErrorResponse } from '@/types/api-types';

const authService = new AuthService();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await authService.register(body);
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    const response = NextResponse.json(result, {
      status: result.success ? 201 : 400,
    });

    response.cookies.set('token', result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong.',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}
