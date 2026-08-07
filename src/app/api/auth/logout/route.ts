// Next Response
import { NextResponse } from 'next/server';

// Cookies
import { cookies } from 'next/headers';

// Types
import type { AuthApiResponse } from '@/types/user-types';

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.delete('token');

    return NextResponse.json(
      {
        success: true,
        message: 'Logout successful.',
        errors: [],
      } satisfies AuthApiResponse,
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong.',
        errors: [],
      } satisfies AuthApiResponse,
      { status: 500 },
    );
  }
}
