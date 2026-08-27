import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/utils/user-by-token';
import { CalorieService } from '@/services-server/calorie-service';
import type { NutritionLogInput } from '@/types/calorie-types';

const calorieService = new CalorieService();

// Hämta dagens näringsintag
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

    const nutrition = await calorieService.getTodaysCalorie(user.userId);

    return NextResponse.json({
      success: true,
      data: nutrition ?? {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    });
  } catch (error) {
    console.error('GET /api/calories/today error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get today nutrition',
      },
      { status: 500 },
    );
  }
}

// Spara dagens näringsintag
export async function POST(request: Request) {
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

    const body: NutritionLogInput = await request.json();

    const nutrition = await calorieService.saveNutritionLog(user.userId, {
      calories: Number(body.calories),
      protein: Number(body.protein),
      carbs: Number(body.carbs),
      fat: Number(body.fat),
    });

    return NextResponse.json({
      success: true,
      data: nutrition,
    });
  } catch (error) {
    console.error('POST /api/calories/today error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to save nutrition',
      },
      { status: 500 },
    );
  }
}
