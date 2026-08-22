//Responses
import { NextResponse } from 'next/server';

//Services
import { DashboardService } from '@/services-server/dashboard-service';
import { ApiErrorResponse } from '@/types/api-types';
import { getCurrentUser } from '@/utils/auth';

const dashboardService = new DashboardService();

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

    const result = await dashboardService.getDashboard(currentUserId.userId);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Ett oväntat fel inträffade.',
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}
