//Next Response
import { NextResponse } from 'next/server';

//Services
import { HistoryService } from '@/services-server/history-service';
import { ApiErrorResponse } from '@/types/api-types';
import { getTokenFromCookieStore, getUserFromToken } from '@/lib/auth';

const historyService = new HistoryService();

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
    console.log('TOKEN', token);
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
    const result = await historyService.getHistory(Number(userId));
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    console.error('GET /api/history/get data', error);

    return {
      success: false,
      message: 'Server error',
    } satisfies ApiErrorResponse;
  }
}
