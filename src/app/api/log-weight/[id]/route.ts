//Next Request & Next Response
import { NextRequest, NextResponse } from 'next/server';

//Services
import { WeightLogService } from '@/services-server/weight-log-service';
import { AddWeightDto } from '@/schemas/auth-schemas';
import { ApiErrorResponse } from '@/types/api-types';

const weightLogService = new WeightLogService();

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await weightLogService.delete(Number(id));

    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    console.error('Error delete log', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong.',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}

//POST: Crate log of weight
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body: AddWeightDto = await request.json();
    const result = await weightLogService.create(body, Number(id));
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong.',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}
