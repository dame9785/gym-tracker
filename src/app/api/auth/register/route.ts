import { AuthService } from '@/services-server/auth-service';
import type { RegisterUserDto } from '@/dto/user-dtos';
import { NextResponse } from 'next/server';

const authService = new AuthService();

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: RegisterUserDto = await request.json();

    const result = await authService.register(body);

    return NextResponse.json(result, {
      status: result.success ? 201 : 400,
    });
  } catch {
    return NextResponse.json({ message: 'Något fel inträffade' }, { status: 500 });
  }
}
