//Next Response
import { NextResponse } from 'next/server';

//Services
import { ApiErrorResponse } from '@/types/api-types';
import { getTokenFromCookieStore, getUserFromToken } from '@/lib/auth';
import { ProgressService } from '@/services-server/progress-service';

const progressService = new ProgressService();

export async function GET() {
  try {
    const token = await getTokenFromCookieStore();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'No token found',
        } satisfies ApiErrorResponse,
        { status: 401 },
      );
    }

    const payLoad = await getUserFromToken(token);

    if (!payLoad) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized ',
        } satisfies ApiErrorResponse,
        { status: 401 },
      );
    }
    const userId = payLoad.userId;

    const result = await progressService.getProgress(userId);
    return NextResponse.json(result, { status: result.success ? 200 : 204 });
  } catch (error) {
    console.error('GET /api/progress/get data', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Server error',
      },
      { status: 500 },
    );
  }
}
