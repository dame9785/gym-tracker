import { ExerciseService } from '@/services-server/exercise-service';
import { NextRequest, NextResponse } from 'next/server';

const exerciseService = new ExerciseService();
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await exerciseService.delete(Number(id));

    return NextResponse.json({
      success: true,
      message: 'Övningen togs bort.',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Något gick fel.',
      },
      { status: 500 },
    );
  }
}
