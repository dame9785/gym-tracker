import { prisma } from '@/lib/prisma';
import RegisterExerciseDto from '@/dto/register-exercise.dto';

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
}
