import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/utils/user-by-token';
import { CalorieService } from '@/services-server/calorie-service';

const calorieService = new CalorieService();

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    const history = await calorieService.getHistory(user.userId);

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('/api/calories/history error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get calorie history',
      },
      { status: 500 },
    );
  }
}
