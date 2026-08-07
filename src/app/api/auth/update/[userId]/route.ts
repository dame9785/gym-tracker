//Next Request & Responsee
import { NextRequest, NextResponse } from 'next/server';

//Servicees
import { AuthService } from '@/services-server/auth-service';

//Types
import { updateSchema } from '@/schemas/auth-schemas';
import { AuthApiResponse } from '@/types/user-types';

const authService = new AuthService();
export async function PUT(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  try {
    const body = await request.json();

    const validation = updateSchema.safeParse(body);

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

    const response = await authService.updateUser(validation.data, Number(userId));

    return NextResponse.json(response, {
      status: response.success ? 200 : 400,
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
