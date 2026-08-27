import { NextResponse } from 'next/server';

// Helpers
import { calculateCalories } from '@/helpers/calorie-calculator';

// Schemas
import { calorieCalculatorSchema } from '@/schemas/calorie-schema';
import { getCurrentUser } from '@/utils/user-by-token';
import { ApiErrorResponse } from '@/types/api-types';

export async function POST(request: Request) {
  const currentUserId = await getCurrentUser();

  if (!currentUserId) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unauthorized',
      } satisfies ApiErrorResponse,
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    const validation = calorieCalculatorSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid calorie calculator data',
          errors: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = calculateCalories(validation.data);
    console.log(result);
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('POST /api/calories/calculate FULL ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to calculate calories',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}
