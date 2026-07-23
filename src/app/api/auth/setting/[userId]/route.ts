import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services-server/authService';

const authService = new AuthService();
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  // Hämta användaren från databasen
  const user = await authService.getUserById(Number(userId));
  return NextResponse.json(user);
}
