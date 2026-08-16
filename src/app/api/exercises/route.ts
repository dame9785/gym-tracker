//Next Response
import { NextResponse } from 'next/server';

//Services
import { ExerciseService } from '@/services-server/exercise-service';

//Types
import type { RegisterExerciseDto } from '@/types/exercise-types';
import { ApiErrorResponse } from '@/types/api-types';

const exerciseService = new ExerciseService();

export async function GET() {
  try {
    const result = await exerciseService.getAllExersise();
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Server fel, gick inte hämta övningar',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const body: RegisterExerciseDto = await request.json();

  const response = await exerciseService.registerExercise(body);

  return NextResponse.json(response);
}
