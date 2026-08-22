//Next Response
import { NextResponse } from 'next/server';

//Services
import { HistoryService } from '@/services-server/history-service';
import { ApiErrorResponse } from '@/types/api-types';
import { getCurrentUser } from '@/utils/auth';

const historyService = new HistoryService();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;

  try {
    //Get current User from Cookie store
    const currentUserId = await getCurrentUser();

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized ',
        } satisfies ApiErrorResponse,
        { status: 401 },
      );
    }
    const result = await historyService.getHistory(currentUserId.userId, page);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    console.error('GET /api/history/get data', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Server error',
      },
      { status: 500 },
    );
  }
}
