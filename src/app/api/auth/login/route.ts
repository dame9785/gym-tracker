//NEXT.JS Response
import { NextResponse } from 'next/server';

// Services
import { AuthService } from '@/services-server/auth-service';

// Types
import type { ApiErrorResponse } from '@/types/api-types';
import type { LoginDto } from '@/schemas/auth-schemas';

const authService = new AuthService();

export async function POST(request: Request) {
  try {
    const body: LoginDto = await request.json();

    const result = await authService.login(body);
    if (!result.success) {
      return NextResponse.json(result, { status: 401 });
    }

    // Login lyckades → skapa JWT
    const response = NextResponse.json(result, {
      status: 200,
    });

    // Sätt JWT som HttpOnly-cookie
    response.cookies.set('token', result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dagar
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Ett oväntat fel inträffade.',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}
