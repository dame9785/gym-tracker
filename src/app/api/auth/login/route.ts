//Next Response
import { NextResponse } from 'next/server';

//Service
import { AuthService } from '@/services-server/auth-service';

//Types
import type { AuthApiResponse } from '@/types/user-types';
import { LoginDto, loginSchema } from '@/schemas/auth-schemas';

const authService = new AuthService();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      const fieldErrors = Object.fromEntries(validation.error.issues.map((issue) => [issue.path[0], issue.message])) as Partial<Record<keyof LoginDto, string>>;
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed.',
          errors: validation.error.issues.map((x) => x.message),
          fieldErrors,
        } satisfies AuthApiResponse,
        {
          status: 400,
        },
      );
    }

    const response = await authService.login(validation.data);
    return NextResponse.json(response, {
      status: response.success ? 200 : 401,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong.',
        errors: [],
      } satisfies AuthApiResponse,
      {
        status: 500,
      },
    );
  }
}
