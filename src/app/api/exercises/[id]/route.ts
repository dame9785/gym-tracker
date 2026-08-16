//Services
import { ExerciseService } from '@/services-server/exercise-service';

//Next Request & Next Response
import { NextRequest, NextResponse } from 'next/server';

//Types
import { ApiErrorResponse } from '@/types/api-types';
import { UpdateExericseDto } from '@/schemas/exercise-schema';

const exerciseService = new ExerciseService();
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log(id);
    const result = await exerciseService.delete(Number(id));
    console.log(result);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Server fel, gick inte radera övning',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dto: UpdateExericseDto = await request.json();
  try {
    const result = await exerciseService.update(Number(id), dto);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Server fel, gick inte radera övning',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const result = await exerciseService.getById(Number(id));
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
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
