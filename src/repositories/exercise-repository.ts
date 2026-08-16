//Prisma
import { prisma } from '@/lib/prisma';

//Types
import type { RegisterExerciseDto } from '@/types/exercise-types';

export class ExerciseRepository {
  async getAll() {
    return await prisma.exercise.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  async register(dto: RegisterExerciseDto) {
    return await prisma.exercise.create({
      data: {
        name: dto.name,
        muscleGroup: dto.muscleGroup,
        equipment: dto.equipment,
      },
    });
  }

  async delete(id: number) {
    await prisma.workoutExercise.deleteMany({
      where: {
        exerciseId: id,
      },
    });

    return await prisma.exercise.delete({
      where: {
        id,
      },
    });
  }

  async update(id: number, dto: RegisterExerciseDto) {
    return await prisma.exercise.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        muscleGroup: dto.muscleGroup,
        equipment: dto.equipment,
      },
    });
  }

  async getById(id: number) {
    return await prisma.exercise.findUnique({
      where: {
        id,
      },
    });
  }
}
