import { NextRequest, NextResponse } from 'next/server';

import { CalorieService } from '@/services-server/calorie-service';
import { getUserFromToken } from '@/lib/auth';

const calorieService = new CalorieService();

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ej autentiserad',
        },
        { status: 401 },
      );
    }

    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ogiltig användare',
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    const calories = Number(body.calories);
    const protein = Number(body.protein);
    const carbs = Number(body.carbs);
    const fat = Number(body.fat);

    if (Number.isNaN(calories) || Number.isNaN(protein) || Number.isNaN(carbs) || Number.isNaN(fat)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ogiltiga värden',
        },
        { status: 400 },
      );
    }

    const result = await calorieService.saveNutritionLog(user.id, {
      calories,
      protein,
      carbs,
      fat,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Kunde inte spara näringsintag:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Kunde inte spara näringsintaget',
      },
      { status: 500 },
    );
  }
}
