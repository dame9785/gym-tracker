import { NextResponse } from 'next/server';
import { HistoryService } from '@/services-server/history-service';

const historyService = new HistoryService();

export async function GET() {
  try {
    const result = await historyService.getHistory();

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong.',
      },
      { status: 500 },
    );
  }
}
