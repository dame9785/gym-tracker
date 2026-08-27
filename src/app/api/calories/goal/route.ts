import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/utils/user-by-token';
import { CalorieService } from '@/services-server/calorie-service';
import type { CalorieGoal } from '@/types/calorie-types';

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

    const goal = await calorieService.getCalorieGoal(user.userId);

    return NextResponse.json({
      success: true,
      data: {
        calorieGoal: goal?.calorieGoal ?? 'MAINTENANCE',
        calories: goal?.calories ?? null,
        protein: goal?.protein ?? null,
        carbs: goal?.carbs ?? null,
        fat: goal?.fat ?? null,
      },
    });
  } catch (error) {
    console.error('GET /api/calories/goal error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get calorie goal',
      },
      { status: 500 },
    );
  }
}

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

    const body = await request.json();

    const { calorieGoal, calories, protein, carbs, fat } = body;

    // Kontrollera att värdet är giltigt
    const validGoals: CalorieGoal[] = ['WEIGHT_LOSS', 'MAINTENANCE', 'MUSCLE_GAIN'];

    if (!validGoals.includes(calorieGoal)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid calorie goal',
        },
        { status: 400 },
      );
    }

    const updatedGoal = await calorieService.updateNutritionGoal(user.userId, {
      calorieGoal,
      calories,
      protein,
      carbs,
      fat,
    });

    return NextResponse.json({
      success: true,
      data: updatedGoal,
    });
  } catch (error) {
    console.error('POST /api/calories/goal error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update calorie goal',
      },
      { status: 500 },
    );
  }
}
