import { NextRequest, NextResponse } from 'next/server';

// Services
import { AuthService } from '@/services-server/auth-service';

// Types
import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/api-types';
import type { UserSettingsViewModel } from '@/types/user-types';

// Schemas
import { updateSchema } from '@/schemas/auth-schemas';

const authService = new AuthService();

//PUT: UPDATE USER
export async function PUT(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;

    const body = await request.json();

    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      const response: ApiErrorResponse = {
        success: false,
        message: 'Kontrollera formuläret.',
        errors: {
          // mappa dina Zod errors här
        },
      };

      return NextResponse.json(response, {
        status: 400,
      });
    }
    const result = await authService.updateUser(validation.data, Number(userId));

    if (!result.success) {
      const fieldErrors = result.fieldErrors;

      const errors = fieldErrors
        ? Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message]]))
        : undefined;

      const response: ApiErrorResponse = {
        success: false,
        message: result.message,
        ...(errors && { errors }),
      };

      return NextResponse.json(response, {
        status: 400,
      });
    }

    const response: ApiSuccessResponse<UserSettingsViewModel> = {
      success: true,
      data: result.data,
      message: 'Användaren uppdaterades.',
    };

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error('PUT /api/auth/update/[userId] failed:', error);

    const response: ApiErrorResponse = {
      success: false,
      message: 'Kunde inte uppdatera användaren.',
    };

    return NextResponse.json(response, {
      status: 500,
    });
  }
}
