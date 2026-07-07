import { NextResponse } from 'next/server';
import { AuthService } from '@/services/AuthService';
import { cookies } from 'next/headers';

const authService = new AuthService();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { user, token } = await authService.login(body.email, body.password);
    const cookieStore = await cookies();

    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
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
