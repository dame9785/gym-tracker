import { NextResponse } from 'next/server';
import { GoalTypesService } from '@/services-server/goal-service';
import { ApiErrorResponse } from '@/types/api-types';

const goalService = new GoalTypesService();

// GET all goal types
export async function GET() {
  try {
    const result = await goalService.getAllGoals();
    return NextResponse.json(result, {
      status: result.success ? 200 : 404,
    });
  } catch (error) {
    console.error('Failed to fetch goal types:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Kunde inte hämta måltyper.',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}
