import { NextResponse } from 'next/server';

// Services
import MealService from '@/services-server/meal-service';

// Schemas
import { addMealItemSchema } from '@/schemas/meal-schemas';

// Utils
import { apiErrorResponse, apiResponse, unauthorizedResponse } from '@/utils/api-error';
import { getCurrentUser } from '@/utils/user-by-token';

const mealService = new MealService();

export async function POST(request: Request) {
  // 1. Hämta inloggad användare
  const userId = 1;

  try {
    // 2. Hämta data från request
    const body = await request.json();

    // 3. Validera med Zod
    const validation = addMealItemSchema.safeParse(body);

    if (!validation.success) {
      return unauthorizedResponse();
    }

    // 4. Lägg till maten i måltiden
    const result = await mealService.addFoodToMeal(userId, validation.data);

    // 5. Returnera resultat
    return apiResponse(
      {
        success: true,
        data: result,
      },
      201,
    );
  } catch (error) {
    console.error('POST /api/meals error:', error);

    return apiErrorResponse('An error occurred while adding food to meal.');
  }
}

export async function GET(request: Request) {
  //Get current User from Cookie storage
  const user = await getCurrentUser();

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    // 2. Hämta dagens måltider
    const result = await mealService.getTodayMeals(user.userId);

    // 3. Returnera resultatet
    return apiResponse(result);
  } catch (error) {
    console.error('GET /api/meals error:', error);

    return apiErrorResponse('An error occurred while fetching today meals.');
  }
}
