import { prisma } from '@/lib/prisma';
import RegisterExerciseDto from '@/dto/register-exercise.dto';
import { id } from 'zod/locales';

export class ExerciseRepository {
  async getAll() {
    return await prisma.exercise.findMany();
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
