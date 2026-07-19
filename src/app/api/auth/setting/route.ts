import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/server/services/authService';

const authService = new AuthService();
export async function GET(request: NextRequest) {
  var user = authService.getCurrentUser;
  return user;
}
