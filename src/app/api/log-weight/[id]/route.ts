//Next Request & Next Response
import { NextRequest, NextResponse } from 'next/server';

//Services
import { WeightLogService } from '@/services-server/weight-log-service';

const weightLogService = new WeightLogService();

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const result = await weightLogService.delete(Number(id));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error delete log', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Något gick fel.',
      },
      { status: 500 },
    );
  }
}
