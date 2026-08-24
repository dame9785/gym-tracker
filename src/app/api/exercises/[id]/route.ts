//Services
import { ExerciseService } from '@/services-server/exercise-service';

//Next Request & Next Response
import { NextRequest, NextResponse } from 'next/server';

//Types

import { UpdateExericseDto } from '@/schemas/exercise-schema';
import { apiErrorResponse, apiResponse } from '@/utils/api-error';

const exerciseService = new ExerciseService();
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const result = await exerciseService.delete(Number(id));

    return apiResponse(result);
  } catch (error) {
    console.error('DELETE /api/exercise/id error:', error);
    return apiErrorResponse('An error occurred while delete exericse.');
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dto: UpdateExericseDto = await request.json();
  try {
    const result = await exerciseService.update(Number(id), dto);
    return apiResponse(result);
  } catch (error) {
    console.error('PUT /api/exercise/id error:', error);
    return apiErrorResponse('An error occurred while updating exericse.');
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const result = await exerciseService.getById(Number(id));
    return apiResponse(result);
  } catch (error) {
    console.error('GET /api/exercise/id error:', error);
    return apiErrorResponse('An error occurred while fetching exericse.');
  }
}
