//Services
import { WeightLogService } from '@/services-server/weight-log-service';

//Next Response
import { NextResponse } from 'next/server';

const weightLogService = new WeightLogService();

export async function GET(): Promise<NextResponse> {
  try {
    const response = await weightLogService.getAll();
    return NextResponse.json(response, {
      status: response.statusCode,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Server error',
        logList: [],
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    if (!body) {
      return NextResponse.json({ success: false, message: 'Request body saknas.' }, { status: 400 });
    }
    const result = await weightLogService.create(body);

    return NextResponse.json(result, {
      status: result.statusCode,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Ett serverfel inträffade.' }, { status: 500 });
  }
}
