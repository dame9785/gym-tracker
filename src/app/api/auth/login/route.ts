import { NextResponse } from 'next/server';
import { AuthService } from '@/server/services/authService';

const authService = new AuthService();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { token } = await authService.login(body.email, body.password);

    return NextResponse.json(
      {
        token,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
