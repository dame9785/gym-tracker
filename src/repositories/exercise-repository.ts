import { prisma } from '@/lib/prisma';
import { RegisterExericseDto, UpdateExericseDto } from '@/schemas/exercise-schema';
import { MuscleRole, Prisma } from '@prisma/client';

type MuscleInput = {
  primaryMuscle: string;
  secondaryMuscles: string[];
};

export class ExerciseRepository {
  async getAllExersise(userId: number) {
    return prisma.exercise.findMany({
      where: { userId },
      include: {
        muscles: {
          include: {
            muscleGroup: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  async register(dto: RegisterExericseDto, userId: number) {
    const muscleRelations = this.buildMuscleRelations({
      primaryMuscle: dto.primaryMuscle,
      secondaryMuscles: dto.secondaryMuscles,
    });

    return prisma.exercise.create({
      data: {
        name: dto.name,
        equipment: dto.equipment || null,
        imagePath: dto.imagePath ?? null,
        description: dto.description,
        instructions: dto.instructions,
        techniqueTips: dto.techniqueTips || null,
        userId,
        muscles: {
          create: muscleRelations.map(({ name, role }) => ({
            role,
            muscleGroup: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })),
        },
      },
      include: {
        muscles: {
          include: { muscleGroup: true },
        },
      },
    });
  }

  async delete(id: number, userId: number) {
    const result = await prisma.exercise.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new Error('Exercise not found or unauthorized');
    }

    return result;
  }

  async update(id: number, dto: UpdateExericseDto, userId: number) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.exercise.findFirst({
        where: { id, userId },
        include: {
          muscles: {
            include: { muscleGroup: true },
          },
        },
      });

      if (!existing) {
        throw new Error('Exercise not found or unauthorized');
      }

      const musclesChanged = dto.primaryMuscle !== undefined || dto.secondaryMuscles !== undefined;

      const data: Prisma.ExerciseUpdateInput = {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.equipment !== undefined && {
          equipment: dto.equipment || null,
        }),
        ...(dto.imagePath !== undefined && {
          imagePath: dto.imagePath,
        }),
        ...(dto.description !== undefined && {
          description: dto.description,
        }),
        ...(dto.instructions !== undefined && {
          instructions: dto.instructions,
        }),
        ...(dto.techniqueTips !== undefined && {
          techniqueTips: dto.techniqueTips || null,
        }),
      };

      await tx.exercise.update({
        where: {
          id,
          userId,
        },
        data,
      });

      if (musclesChanged) {
        const primaryMuscle = dto.primaryMuscle ?? existing.muscles.find((muscle) => muscle.role === MuscleRole.PRIMARY)?.muscleGroup.name;

        if (!primaryMuscle) {
          throw new Error('A primary muscle group is required');
        }

        const secondaryMuscles =
          dto.secondaryMuscles ?? existing.muscles.filter((muscle) => muscle.role === MuscleRole.SECONDARY).map((muscle) => muscle.muscleGroup.name);

        const relations = this.buildMuscleRelations({
          primaryMuscle,
          secondaryMuscles,
        });

        await tx.exerciseMuscle.deleteMany({
          where: { exerciseId: id },
        });

        for (const relation of relations) {
          const muscleGroup = await tx.muscleGroup.upsert({
            where: { name: relation.name },
            create: { name: relation.name },
            update: {},
          });

          await tx.exerciseMuscle.create({
            data: {
              exerciseId: id,
              muscleGroupId: muscleGroup.id,
              role: relation.role,
            },
          });
        }
      }

      return tx.exercise.findFirstOrThrow({
        where: {
          id,
          userId,
        },
        include: {
          muscles: {
            include: { muscleGroup: true },
          },
        },
      });
    });
  }

  async getById(id: number, userId: number) {
    return prisma.exercise.findFirst({
      where: { id, userId },
      include: {
        muscles: {
          include: { muscleGroup: true },
        },
      },
    });
  }

  async getBySlug(slug: string, userId: number) {
    return prisma.exercise.findFirst({
      where: { slug, userId },
      include: {
        muscles: {
          include: { muscleGroup: true },
        },
      },
    });
  }

  private buildMuscleRelations(input: MuscleInput) {
    const primaryMuscle = input.primaryMuscle.trim();

    if (!primaryMuscle) {
      throw new Error('A primary muscle group is required');
    }

    const normalizedSecondary = input.secondaryMuscles.map((name) => name.trim());

    if (normalizedSecondary.some((name) => !name)) {
      throw new Error('Muscle group names cannot be empty');
    }

    const uniqueSecondary = [...new Map(normalizedSecondary.map((name) => [name.toLowerCase(), name])).values()].filter(
      (name) => name.toLowerCase() !== primaryMuscle.toLowerCase(),
    );

    return [
      {
        name: primaryMuscle,
        role: MuscleRole.PRIMARY,
      },
      ...uniqueSecondary.map((name) => ({
        name,
        role: MuscleRole.SECONDARY,
      })),
    ];
  }
}
