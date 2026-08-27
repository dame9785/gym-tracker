//Next Response & Next Request
import { FoodRepository } from '@/repositories/food-repository';
import { NextResponse, NextRequest } from 'next/server';

//Services
const foodReposository = new FoodRepository();

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = foodReposository.delete(Number(id));
  return NextResponse.json(result, { status: 200 });
}
