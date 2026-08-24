//Next Request & Next Response
import { NextRequest } from 'next/server';

//Services
import { WeightLogService } from '@/services-server/weight-log-service';
import { getCurrentUser } from '@/utils/user-by-token';
import { apiErrorResponse, apiResponse, unauthorizedResponse } from '@/utils/api-error';
import { UpdateWeightDto } from '@/schemas/weight-log.schemas';

const weightLogService = new WeightLogService();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    const result = await weightLogService.getById(Number(id));

    return apiResponse(result);
  } catch (error) {
    console.error('GET /api/weight-logs/id error:', error);
    return apiErrorResponse('An error occurred while fetching weight logs.');
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;

    const body: UpdateWeightDto = await request.json();
    const result = await weightLogService.update(id, body, user.userId);

    return apiResponse(result);
  } catch (error) {
    console.error('PUT /api/weight-logs error:', error);
    return apiErrorResponse('An error occurred while updating the weight log.');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    const result = await weightLogService.delete(Number(id), user.userId);

    return apiResponse(result);
  } catch (error) {
    console.error('DELETE /api/weight-logs error:', error);
    return apiErrorResponse('An error occurred while deleting the weight log.');
  }
}
