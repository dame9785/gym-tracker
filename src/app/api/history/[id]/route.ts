//Next Response
import { NextRequest, NextResponse } from 'next/server';

//Services
import { HistoryService } from '@/services-server/history-service';
import { ApiErrorResponse } from '@/types/api-types';

const historyService = new HistoryService();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const result = await historyService.getHistory(Number(id));
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    console.error('POST /api/history/get data', error);

    return {
      success: false,
      message: 'Server error',
    } satisfies ApiErrorResponse;
  }
}
