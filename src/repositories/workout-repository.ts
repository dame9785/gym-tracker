import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

import type { AddWorkoutDto, UpdateWorkoutDto } from '@/schemas/workout-schemas';

const workoutExerciseInclude = {
  exercise: {
    include: {
      muscles: {
        include: {
          muscleGroup: true,
        },
      },
    },
  },
} satisfies Prisma.WorkoutExerciseInclude;

const workoutWithExercisesInclude = {
  exercises: {
    where: {
      archivedAt: null,
    },
    include: workoutExerciseInclude,
    orderBy: {
      order: 'asc',
    },
  },
} satisfies Prisma.WorkoutInclude;

type WorkoutWithExercises = Prisma.WorkoutGetPayload<{
  include: typeof workoutWithExercisesInclude;
}>;

type WorkoutWithExistingExercises = Prisma.WorkoutGetPayload<{
  select: {
    id: true;
    exercises: {
      where: {
        archivedAt: null;
      };
      orderBy: {
        order: 'asc';
      };
    };
  };
}>;

export class WorkoutRepository {
  async create(dto: AddWorkoutDto, userId: number): Promise<WorkoutWithExercises> {
    return prisma.$transaction(async (tx) => {
      const exerciseIds = dto.workoutExercises.map((exercise) => exercise.exerciseId);

      if (new Set(exerciseIds).size !== exerciseIds.length) {
        throw new Error('Duplicate exercises are not allowed.');
      }

      const uniqueExerciseIds = [...new Set(exerciseIds)];

      const ownedExercises = await tx.exercise.findMany({
        where: {
          id: {
            in: uniqueExerciseIds,
          },
          userId,
          archivedAt: null,
        },
        select: {
          id: true,
        },
      });

      if (ownedExercises.length !== uniqueExerciseIds.length) {
        throw new Error('One or more exercises are invalid or archived.');
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
        include: workoutWithExercisesInclude,
      });
    });
  }

  async getAll(userId: number, page: number, pageSize: number): Promise<WorkoutWithExercises[]> {
    if (!Number.isSafeInteger(page) || page < 1) {
      throw new Error('Invalid page number.');
    }

    if (!Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 100) {
      throw new Error('Invalid page size.');
    }

    const skip = (page - 1) * pageSize;

    if (!Number.isSafeInteger(skip)) {
      throw new Error('Invalid pagination offset.');
    }

    return prisma.workout.findMany({
      where: {
        userId,
        archivedAt: null,
      },
      include: workoutWithExercisesInclude,
      orderBy: {
        createdAt: 'asc',
      },
      skip,
      take: pageSize,
    });
  }

  async update(id: number, dto: UpdateWorkoutDto, userId: number): Promise<WorkoutWithExercises | null> {
    return prisma.$transaction(async (tx) => {
      const exerciseIds = dto.workoutExercises.map((exercise) => exercise.exerciseId);

      if (new Set(exerciseIds).size !== exerciseIds.length) {
        throw new Error('Duplicate exercises are not allowed.');
      }

      const workout: WorkoutWithExistingExercises | null = await tx.workout.findFirst({
        where: {
          id,
          userId,
          archivedAt: null,
        },
        select: {
          id: true,
          exercises: {
            where: {
              archivedAt: null,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });

      if (!workout) {
        return null;
      }

      // Existing exercises may remain even if they have been archived.
      // Only newly added exercises must be active and owned by the user.
      const existingExerciseIds = new Set(workout.exercises.map((exercise) => exercise.exerciseId));

      const newExerciseIds = exerciseIds.filter((exerciseId) => !existingExerciseIds.has(exerciseId));

      if (newExerciseIds.length > 0) {
        const availableExercises = await tx.exercise.findMany({
          where: {
            id: {
              in: newExerciseIds,
            },
            userId,
            archivedAt: null,
          },
          select: {
            id: true,
          },
        });

        if (availableExercises.length !== newExerciseIds.length) {
          throw new Error('One or more exercises are invalid or archived.');
        }
      }

      await tx.workout.update({
        where: {
          id,
          userId,
          archivedAt: null,
        },
        data: {
          name: dto.name,
          description: dto.description,
        },
      });

      const existingExercises = workout.exercises;
      const retainedIds = new Set<number>();

      let order = 1;

      for (const exercise of dto.workoutExercises) {
        const existing = existingExercises.find((item) => item.exerciseId === exercise.exerciseId);

        if (existing) {
          retainedIds.add(existing.id);

          await tx.workoutExercise.update({
            where: {
              id: existing.id,
              workoutId: id,
            },
            data: {
              sets: exercise.sets,
              reps: exercise.reps,
              weight: exercise.weight,
              seconds: exercise.seconds,
              note: exercise.note,
              order,
            },
          });
        } else {
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
        }

        order++;
      }

      const removedExerciseIds = existingExercises.filter((exercise) => !retainedIds.has(exercise.id)).map((exercise) => exercise.id);

      if (removedExerciseIds.length > 0) {
        await tx.workoutExercise.updateMany({
          where: {
            id: {
              in: removedExerciseIds,
            },
            workoutId: id,
            archivedAt: null,
          },
          data: {
            archivedAt: new Date(),
          },
        });
      }

      return tx.workout.findFirst({
        where: {
          id,
          userId,
          archivedAt: null,
        },
        include: workoutWithExercisesInclude,
      });
    });
  }

  async getById(id: number, userId: number): Promise<WorkoutWithExercises | null> {
    return prisma.workout.findFirst({
      where: {
        id,
        userId,
        archivedAt: null,
      },
      include: workoutWithExercisesInclude,
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    await prisma.workout.updateMany({
      where: {
        id,
        userId,
        archivedAt: null,
      },
      data: {
        archivedAt: new Date(),
      },
    });
  }

  async getTotalNumberOfWorkouts(userId: number): Promise<number> {
    return prisma.workout.count({
      where: {
        userId,
        archivedAt: null,
      },
    });
  }
}
