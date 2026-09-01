//Prisma
import { prisma } from '@/lib/prisma';

//Types
import type { RegisterExerciseDto } from '@/types/exercise-types';

export class ExerciseRepository {
  async getAllExersise(userId: number) {
    return await prisma.exercise.findMany({
      where: {
        userId,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async register(dto: RegisterExerciseDto, userId: number) {
    return await prisma.exercise.create({
      data: {
        name: dto.name,
        muscleGroup: dto.muscleGroup,
        equipment: dto.equipment,
        userId,
      },
    });
  }

  async delete(id: number, userId: number) {
    const result = await prisma.exercise.deleteMany({
      where: {
        id,
        userId,
      },
    });

    if (result.count === 0) {
      throw new Error('Exercise not found or unauthorized');
    }

    return result;
  }

  async update(id: number, dto: RegisterExerciseDto, userId: number) {
    return await prisma.exercise.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        name: dto.name,
        muscleGroup: dto.muscleGroup,
        equipment: dto.equipment,
      },
    });
  }

  async getById(id: number, userId: number) {
    return await prisma.exercise.findUnique({
      where: {
        id,
        userId,
      },
    });
  }
}
