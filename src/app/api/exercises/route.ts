//Next Response
import { NextResponse } from 'next/server';

//Services
import { ExerciseService } from '@/services-server/exercise-service';

//Types
import { ApiErrorResponse } from '@/types/api-types';
import { RegisterExerciseDto } from '@/types/exercise-types';

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
  const dto: RegisterExerciseDto = await request.json();
  try {
    const response = await exerciseService.registerExercise(dto);
    return NextResponse.json(response, { status: response.success ? 200 : 404 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Server fel, gick ej skapa övning',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}
