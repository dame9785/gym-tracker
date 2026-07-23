import { NextRequest, NextResponse } from 'next/server';
import { WorkoutScheduleService } from '@/services-server/workout-schedule-service';

const workoutScheduleService = new WorkoutScheduleService();

export async function POST(request: NextRequest) {
  try {
    const dto = await request.json();

    const result = await workoutScheduleService.create(dto);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Ett oväntat fel inträffade.',
      },
      { status: 500 },
    );
  }
}
