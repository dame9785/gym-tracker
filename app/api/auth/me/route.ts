import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/AuthService';

const authService = new AuthService();

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    const user = await authService.getCurrentUser(token);

    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      bodyWeight: user.bodyWeight,
      height: user.height,
      gender: user.gender,
      birthDate: user.birthDate,
    });
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
