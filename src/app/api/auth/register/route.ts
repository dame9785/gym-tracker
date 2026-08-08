import { NextResponse } from 'next/server';

// Services
import { AuthService } from '@/services-server/auth-service';

// Types
import type { AuthApiResponse } from '@/types/user-types';

// Schemas
import { registerSchema } from '@/schemas/auth-schemas';

const authService = new AuthService();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      const fieldErrors = Object.fromEntries(
        validation.error.issues.map((issue) => [String(issue.path[0]), issue.message]),
      );

      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed.',
          errors: validation.error.issues.map((issue) => issue.message),
          fieldErrors,
        },
        { status: 400 },
      );
    }

    const result = await authService.register(validation.data);

    const response = NextResponse.json(result, {
      status: result.success ? 201 : 400,
    });

    if (result.success && result.userToken) {
      response.cookies.set('token', result.userToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong.',
        errors: [],
      } satisfies AuthApiResponse,
      { status: 500 },
    );
  }
}
