import { NextResponse } from 'next/server';
import { AuthService } from '@/services-server/authService';
import type { RegisterUserDto } from '@/dto/register-user-dto';
import { UserValidationResponse } from '@/responses/user-validation-response';

const authService = new AuthService();

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const registerDto: RegisterUserDto = await request.json();
    const result: UserValidationResponse = await authService.register(registerDto);

    return NextResponse.json(result, {
      status: result.success ? 201 : 400,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Ett oväntat fel inträffade.',
        errors: [],
      },
      {
        status: 500,
      },
    );
  }
}
