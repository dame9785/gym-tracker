//Next Request & Next Response
import { NextRequest, NextResponse } from 'next/server';

//Services
import { WeightLogService } from '@/services-server/weight-log-service';
import { ApiErrorResponse } from '@/types/api-types';

const weightLogService = new WeightLogService();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const result = await weightLogService.getById(Number(id));

    return NextResponse.json(result, {
      status: result.success ? 200 : 404,
    });
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
