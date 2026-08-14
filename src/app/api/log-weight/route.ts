import { WeightLogService } from '@/services-server/weight-log-service';
import { ApiErrorResponse } from '@/types/api-types';

//Next Response
import { NextResponse } from 'next/server';

const weightLogService = new WeightLogService();

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await weightLogService.getAll(Number(id));

    return NextResponse.json(response, { status: response.success ? 200 : 404 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong.',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}
