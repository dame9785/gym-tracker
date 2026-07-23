import { NextResponse } from 'next/server';
import { DashboardService } from '@/services-server/dashboardService';

const dashboardService = new DashboardService();

export async function GET() {
  try {
    const result = await dashboardService.getWeeklyOverview();

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: 'Ett oväntat fel inträffade.',
      },
      { status: 500 },
    );
  }
}
