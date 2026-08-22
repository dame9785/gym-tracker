//Responses
import { NextResponse } from 'next/server';

//Services
import { DashboardService } from '@/services-server/dashboard-service';
import { ApiErrorResponse } from '@/types/api-types';
import { getTokenFromCookieStore, getUserFromToken } from '@/lib/auth';

const dashboardService = new DashboardService();

export async function GET() {
  try {
    const token = await getTokenFromCookieStore();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'No token found',
        } satisfies ApiErrorResponse,
        { status: 401 },
      );
    }

    const payLoad = await getUserFromToken(token);

    if (!payLoad) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized ',
        } satisfies ApiErrorResponse,
        { status: 401 },
      );
    }
    const userId = payLoad.userId;

    const result = await dashboardService.getDashboard(userId);
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
