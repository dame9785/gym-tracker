//Next Server Response
import { NextResponse } from 'next/server';

//Services
import { AuthService } from '@/services-server/auth-service';

//Types
import type { AuthApiResponse } from '@/types/user-types';

//Schemas
import { registerSchema } from '@/schemas/auth-schemas';

const authService = new AuthService();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = registerSchema.safeParse(body);
    console.log(validation);
    if (!validation.success) {
      const fieldErrors = Object.fromEntries(validation.error.issues.map((issue) => [issue.path[0], issue.message]));
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed.',
          errors: validation.error.issues.map((x) => x.message),
          fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const response = await authService.register(validation.data);
    return NextResponse.json(response, {
      status: response.success ? 201 : 400,
    });
  } catch (error) {
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
