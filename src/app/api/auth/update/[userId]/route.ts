import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services-server/authService';
import { UpdateUserDto } from '@/dto/update-user-dto';

const authService = new AuthService();
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  const updateUserDto: UpdateUserDto = await request.json();

  const response = await authService.updateUser(updateUserDto, Number(userId));

  return NextResponse.json(response);
}
