import { NextResponse } from 'next/server';
import { GoalTypesService } from '@/services-server/goal-service';
import type { GoalTypeApiResponse } from '@/types/goal-types';

const goalService = new GoalTypesService();

// GET all goal types
export async function GET() {
  try {
    const goalTypes = await goalService.getAllGoals();

    return NextResponse.json(
      {
        success: true,
        message: 'Måltyper hämtades.',
        goalTypes,
      } satisfies GoalTypeApiResponse,
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to fetch goal types:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Kunde inte hämta måltyper.',
        goalTypes: [],
      } satisfies GoalTypeApiResponse,
      { status: 500 },
    );
  }
}
