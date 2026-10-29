import { prisma } from '@/lib/prisma';
import type { AddWorkoutDto, UpdateWorkoutDto } from '@/schemas/workout-schemas';

export class WorkoutRepository {
  async create(dto: AddWorkoutDto, userId: number) {
    return prisma.$transaction(async (tx) => {
      const exerciseIds = [...new Set(dto.workoutExercises.map((exercise) => exercise.exerciseId))];

      if (exerciseIds.length > 0) {
        const ownedExercises = await tx.exercise.findMany({
          where: {
            id: { in: exerciseIds },
            userId,
          },
          select: {
            id: true,
          },
        });

        if (ownedExercises.length !== exerciseIds.length) {
          throw new Error('One or more exercises are invalid.');
        }
      }

      const workout = await tx.workout.create({
        data: {
          userId,
          name: dto.name,
          description: dto.description,
        },
      });

      let order = 1;

      for (const exercise of dto.workoutExercises) {
        await tx.workoutExercise.create({
          data: {
            workoutId: workout.id,
            exerciseId: exercise.exerciseId,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            note: exercise.note,
            seconds: exercise.seconds,
            order,
          },
        });

        order++;
      }

      return tx.workout.findUniqueOrThrow({
        where: {
          id: workout.id,
        },
        include: {
          exercises: {
            include: {
              exercise: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
    });
  }

  async getAll(userId: number, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    return prisma.workout.findMany({
      where: {
        userId,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      skip,
      take: pageSize,
    });
  }

  async update(id: number, dto: UpdateWorkoutDto, userId: number) {
    return prisma.$transaction(async (tx) => {
      const workout = await tx.workout.findFirst({
        where: {
          id,
          userId,
        },
        select: {
          id: true,
        },
      });

      if (!workout) {
        return null;
      }

      const exerciseIds = [...new Set(dto.workoutExercises.map((exercise) => exercise.exerciseId))];

      if (exerciseIds.length > 0) {
        const ownedExercises = await tx.exercise.findMany({
          where: {
            id: { in: exerciseIds },
            userId,
          },
          select: {
            id: true,
          },
        });

        if (ownedExercises.length !== exerciseIds.length) {
          throw new Error('One or more exercises are invalid.');
        }
      }

      await tx.workout.update({
        where: {
          id,
          userId,
        },
        data: {
          name: dto.name,
          description: dto.description,
        },
      });

      await tx.workoutExercise.deleteMany({
        where: {
          workoutId: id,
        },
      });

      let order = 1;

      for (const exercise of dto.workoutExercises) {
        await tx.workoutExercise.create({
          data: {
            workoutId: id,
            exerciseId: exercise.exerciseId,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            seconds: exercise.seconds,
            note: exercise.note,
            order,
          },
        });

        order++;
      }

      // Return the updated workout with its exercises.
      return tx.workout.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          exercises: {
            include: {
              exercise: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
    });
  }

  async getById(id: number, userId: number) {
    return prisma.workout.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    await prisma.workout.delete({
      where: {
        userId,
        id,
      },
    });
  }

  async getTotalNumberOfWorkouts(userId: number): Promise<number> {
    return prisma.workout.count({
      where: {
        userId,
      },
    });
  }
}
