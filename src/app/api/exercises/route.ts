import { NextResponse } from 'next/server';
import { ExerciseService } from '@/services-server/exercise-service';
import RegisterResponse from '@/responses/exercise-response';
import RegisterExerciseDto from '@/dto/register-exercise.dto';

const exerciseService = new ExerciseService();

export async function GET() {
  try {
    const exercises = await exerciseService.getAllExersise();
    return NextResponse.json(exercises, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Något gick fel.',
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  const body: RegisterExerciseDto = await request.json();

  const response = await exerciseService.registerExercise(body);

  return NextResponse.json(response);
}
