import { getTokenFromCookieStore, getUserFromToken } from '@/lib/auth';
import { AddWeightDto, EditWeightDto } from '@/schemas/weight-log.schemas';
import { WeightLogService } from '@/services-server/weight-log-service';
import { ApiErrorResponse } from '@/types/api-types';
import { getCurrentUser } from '@/utils/user-by-token';

//Next Response
import { NextRequest, NextResponse } from 'next/server';

const weightLogService = new WeightLogService();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;

  try {
    //Get current User from Cookie store
    const currentUserId = await getCurrentUser();

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized ',
        } satisfies ApiErrorResponse,
        { status: 401 },
      );
    }
    const response = await weightLogService.getAll(currentUserId.userId, page);

    return NextResponse.json(response, { status: response.success ? 200 : 404 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong.',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}

//POST: Crate log of weight
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body: AddWeightDto = await request.json();
    const result = await weightLogService.create(body, Number(id));
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong.',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await weightLogService.delete(Number(id));

    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    console.error('Error delete log', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong.',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body: EditWeightDto = await request.json();

    const result = await weightLogService.update(id, body);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong.',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}
