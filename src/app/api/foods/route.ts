import { NextRequest, NextResponse } from 'next/server';
import { FoodService } from '@/services-server/food-service';

const foodService = new FoodService();

export async function GET(request: NextRequest) {
  try {
    // Annars hämta all mat
    const result = await foodService.getAll();

    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    console.error('GET FOODS ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Kunde inte hämta mat',
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const food = await foodService.create({
      name: body.name,
      caloriesPer100g: Number(body.caloriesPer100g),
      proteinPer100g: Number(body.proteinPer100g),
      carbsPer100g: Number(body.carbsPer100g),
      fatPer100g: Number(body.fatPer100g),
    });

    return NextResponse.json(
      {
        success: true,
        data: food,
      },
      {
        status: 201,
      },
    );
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
