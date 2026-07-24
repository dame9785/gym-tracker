import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

//GET All goals
export async function GET() {
  try {
    const goals = await prisma.goalType.findMany();
    return NextResponse.json(goals, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Kunde inte hämta mål.' }, { status: 500 });
  }
}
