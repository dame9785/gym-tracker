//Next Request & Next Response
import { NextRequest, NextResponse } from 'next/server';

//Services
import { WorkoutScheduleService } from '@/services-server/workout-schedule-service';

const workoutScheduleService = new WorkoutScheduleService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const year = Number(searchParams.get('year'));
    const month = Number(searchParams.get('month'));
    const userId = Number(searchParams.get('userId'));

    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ogiltiga parametrar.',
        },
        { status: 400 },
      );
    }

    if (month < 1 || month > 12) {
      return NextResponse.json(
        {
          success: false,
          message: 'Månaden måste vara mellan 1 och 12.',
        },
        { status: 400 },
      );
    }

    const workoutSchedules = await workoutScheduleService.getByMonth(userId, year, month);

    return NextResponse.json(
      {
        success: true,
        workoutSchedules,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('GET /api/workout-schedule ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Ett oväntat fel inträffade.',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const dto = await request.json();

    const result = await workoutScheduleService.create(dto);

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
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
