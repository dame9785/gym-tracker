//Responses
import { NextResponse } from 'next/server';

//Services
import { DashboardService } from '@/services-server/dashboard-service';
import { ApiErrorResponse } from '@/types/api-types';

const dashboardService = new DashboardService();

export async function GET() {
  try {
    const result = await dashboardService.getDashboard();
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
