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
  const user = await getCurrentUser();

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    // 2. Hämta data från request
    const body = await request.json();

    // 3. Validera med Zod
    const validation = addMealItemSchema.safeParse(body);

    if (!validation.success) {
      return unauthorizedResponse();
    }

    // 4. Lägg till maten i måltiden
    const result = await mealService.addFoodToMeal(user.userId, validation.data);

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
  const user = await getCurrentUser();

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(request.url);

    const date = searchParams.get('date');

    const result = date ? await mealService.getMealsByDate(user.userId, date) : await mealService.getTodayMeals(user.userId);

    return apiResponse(result);
  } catch (error) {
    console.error('GET /api/meals error:', error);

    return apiErrorResponse('An error occurred while fetching meals.');
  }
}
