import { AddWeightDto } from '@/schemas/weight-log.schemas';
import { WeightLogService } from '@/services-server/weight-log-service';
import { getCurrentUser } from '@/utils/user-by-token';
import { apiErrorResponse, apiResponse, unauthorizedResponse } from '@/utils//api-error';

//Next Response
import { NextRequest } from 'next/server';

const weightLogService = new WeightLogService();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;

  try {
    //Get current User from Cookie storage
    const user = await getCurrentUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const result = await weightLogService.getAll(user.userId, page);

    return apiResponse(result);
  } catch (error) {
    console.error('GET /api/weight-logs error:', error);
    return apiErrorResponse('An error occurred while fetching weight logs.');
  }
}

//POST: Crate log of weight
export async function POST(request: NextRequest) {
  //Get current User from Cookie store
  const user = await getCurrentUser();

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const body: AddWeightDto = await request.json();
    const result = await weightLogService.create(body, user.userId);

    return apiResponse(result, 201);
  } catch (error) {
    console.error('POST /api/weight-logs error:', error);
    return apiErrorResponse('An error occurred while creating the weight log.');
  }
}
