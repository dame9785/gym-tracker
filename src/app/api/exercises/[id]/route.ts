//Services
import { ExerciseService } from '@/services-server/exercise-service';

//Next Request & Next Response
import { NextRequest, NextResponse } from 'next/server';

//Types
import type { RegisterExerciseDto } from '@/types/exercise-types';

const exerciseService = new ExerciseService();
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body: RegisterExerciseDto = await request.json();
  try {
    const viewModel = await exerciseService.update(Number(id), body);
    return NextResponse.json(
      {
        success: true,
        viewModel,
        message: 'Övning uppdaterad',
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        viewModel: [],
        message: 'Övning ej uppdaterad',
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const exericse = await exerciseService.getById(Number(id));
    return NextResponse.json({
      exericse,
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
