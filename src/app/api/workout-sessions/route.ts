import { NextRequest, NextResponse } from 'next/server';
import { WorkoutSessionService } from '@/services-server/workout-session-service';
import { AuthService } from '@/services-server/auth-service';

const workoutSessionService = new WorkoutSessionService();
const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    const token = authHeader.replace('Bearer ', '');

    const user = await authService.getCurrentUser(token);

    const dto = await request.json();

    const result = await workoutSessionService.create(user.id, dto.workoutId);

    return NextResponse.json(result, {
      status: result.success ? 201 : 400,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Något gick fel.',
      },
      { status: 500 },
    );
  }
}
