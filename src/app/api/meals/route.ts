import { NextResponse } from 'next/server';

import { ApiErrorResponse } from '@/types/api-types';
import { MealService } from '@/services-server/meal-service';
import { MealRepository } from '@/repositories/meal-repository';

const mealService = new MealService();
const mealRepository = new MealRepository();

export async function GET() {
  //Get current User from Cookie store
  // const currentUserId = await getCurrentUser();

  // if (!currentUserId) {
  //   return NextResponse.json(
  //     {
  //       success: false,
  //       message: 'Unauthorized ',
  //     } satisfies ApiErrorResponse,
  //     { status: 401 },
  //   );
  // }

  try {
    const result = await mealService.getMeals(1);

    return NextResponse.json(result, { status: result.success ? 200 : 402 });
  } catch (error) {
    console.error('Failed to fetch meals', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Kunde inte hämta måltyper.',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    const meal = await mealRepository.create({
      userId: 1,
      name: 'Spenatstavar',
      mealType: 'LUNCH',

      items: [
        {
          foodId: 1,
          grams: 200,
          calories: 330,
          protein: 62,
          carbs: 0,
          fat: 7.2,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: meal,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Could not create meal',
      },
      {
        status: 500,
      },
    );
  }
}
