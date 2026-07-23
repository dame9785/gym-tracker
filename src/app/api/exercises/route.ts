import { NextResponse } from 'next/server';
import { ExerciseService } from '@/services-server/exerciseService';

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
