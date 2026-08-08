//Next Response
import { NextRequest, NextResponse } from 'next/server';

//Services
import { AuthService } from '@/services-server/auth-service';

const authService = new AuthService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const user = await authService.getUserById(Number(userId));

    if (!user) {
      return NextResponse.json(
        { message: 'Användaren hittades inte.' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('GET /api/setting/[userId] failed:', error);

    return NextResponse.json(
      { message: 'Kunde inte hämta användaren.' },
      { status: 500 }
    );
  }
}