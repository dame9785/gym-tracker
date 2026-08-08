import { NextResponse, NextRequest } from 'next/server';
import { AuthApiResponse } from '@/types/user-types';
import { getAuthenticatedUser } from '@/lib/auth';
import { updateSchema } from '@/schemas/auth-schemas';
import authService from '@/services/auth-service';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;
    const id = Number(userId);

    // Validate user ID
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Hämting av måltyper lyckades!',
          errors: [],
        } satisfies AuthApiResponse,
        { status: 400 },
      );
    }

    // Authentication
    const authenticatedUser = getAuthenticatedUser(request);

    if (!authenticatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ogiltig eller utgången token.',
          errors: [],
          isTokenExperied: true,
        } satisfies AuthApiResponse,
        { status: 401 },
      );
    }

    // Authorization
    if (authenticatedUser.userId !== id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Du har inte behörighet.',
          errors: [],
        } satisfies AuthApiResponse,
        { status: 403 },
      );
    }

    // Request body
    const body = await request.json();

    // Validation
    const validation = updateSchema.safeParse(body);

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
        } satisfies AuthApiResponse,
        { status: 400 },
      );
    }

    // Business logic
    const response = await authService.update(validation.data, authenticatedUser.userId);

    return NextResponse.json(response, {
      status: response.success ? 200 : 400,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong.',
        errors: [],
      } satisfies AuthApiResponse,
      { status: 500 },
    );
  }
}
