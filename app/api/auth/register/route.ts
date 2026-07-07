import { NextResponse } from 'next/server';
import { AuthService } from '@/services/AuthService';

const authService = new AuthService();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const user = await authService.register(body);

    return NextResponse.json(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        description: user.description,
        bodyWeight: user.bodyWeight,
        height: user.height,
        gender: user.gender,
        birthDate: user.birthDate,
        createdAt: user.createdAt,
      },
      { status: 201 },
    );

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 },
    );
  }
}
