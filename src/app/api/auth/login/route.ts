import { NextResponse } from 'next/server';

// Services
import { AuthService } from '@/services-server/auth-service';

// Types
import type { ApiErrorResponse } from '@/types/api-types';

// Schemas
import { loginSchema } from '@/schemas/auth-schemas';
import type { LoginDto } from '@/schemas/auth-schemas';

// Helpers
import { ErrorsHelper } from '@/helpers/error-helper';
import { generateToken } from '@/lib/jwt';

const authService = new AuthService();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = loginSchema.safeParse(body);

    // Request validation
    if (!validation.success) {
      const fieldErrors = ErrorsHelper.getFormErrors<LoginDto>(validation.error.issues);

      const errors = Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message]]));

      const response: ApiErrorResponse = {
        success: false,
        message: 'Kontrollera formuläret.',
        errors,
      };

      return NextResponse.json(response, {
        status: 400,
      });
    }

    // Login
    const result = await authService.login(validation.data);
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
    console.error('POST /api/auth/login failed:', error);

    const response: ApiErrorResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Ett oväntat fel inträffade.',
    };

    return NextResponse.json(response, {
      status: 500,
    });
  }
}
