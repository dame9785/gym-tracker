import { prisma } from '@/lib/prisma';

export class ExerciseRepository {
  async getAll() {
    return await prisma.exercise.findMany();
  }
}
