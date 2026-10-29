//Prisma
import { prisma } from '@/lib/prisma';
import { AddWorkoutDto, UpdateWorkoutDto } from '@/schemas/workout-schemas';

export class WorkoutRepository {
  async create(dto: AddWorkoutDto, userId: number) {
    return prisma.$transaction(async (tx) => {
      // Get unique exercise IDs from the submitted workout.
      const exerciseIds = [...new Set(dto.workoutExercises.map((exercise) => exercise.exerciseId))];

      // Verify that every exercise belongs to this user.
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

      // Create the workout only after ownership validation.
      const workout = await tx.workout.create({
        data: {
          userId,
          name: dto.name,
          description: dto.description,
        },
      });

      // Add the workout exercises.
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

      // Return the workout with its exercises.
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
    return await prisma.workout.findMany({
      where: {
        userId: userId,
      },

      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: {
            id: 'desc',
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
      // Verify that the workout belongs to the authenticated user.
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

      // Verify that all exercises belong to the authenticated user.
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

      return { id };
    });
  }

  async getById(id: number, userId: number) {
    return await prisma.workout.findFirst({
      where: {
        id,
        userId: userId,
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

  async delete(id: number, userId: number) {
    return await prisma.workout.delete({
      where: {
        userId,
        id,
      },
    });
  }

  async getTotalNumberOfWorkouts(userId: number) {
    return prisma.workout.count({
      where: {
        userId: userId,
      },
    });
  }
}
