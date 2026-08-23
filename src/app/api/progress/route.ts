//Next Response
import { NextResponse } from 'next/server';

//Services
import { ApiErrorResponse } from '@/types/api-types';
import { ProgressService } from '@/services-server/progress-service';
import { getCurrentUser } from '@/utils/user-by-token';

const progressService = new ProgressService();

export async function GET() {
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

    const result = await progressService.getProgress(currentUserId.userId);
    return NextResponse.json(result, { status: result.success ? 200 : 204 });
  } catch (error) {
    console.error('GET /api/progress/get data', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Server error',
      },
      { status: 500 },
    );
  }
}
