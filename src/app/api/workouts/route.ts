import { NextRequest, NextResponse } from 'next/server';
import { WorkoutService } from '@/services-server/workoutService';

const workoutService = new WorkoutService();

export async function POST(request: NextRequest) {
  try {
    const dto = await request.json();

    const result = await workoutService.create(dto);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);

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
