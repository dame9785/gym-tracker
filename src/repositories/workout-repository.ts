//Types
import { RegisterWorkoutDto } from '@/types/workout-types';

//Prisma
import { prisma } from '@/lib/prisma';
import { UpdateWorkoutDto } from '@/schemas/workout-schemas';

export class WorkoutRepository {
  async create(dto: RegisterWorkoutDto, userId: number) {
    return await prisma.$transaction(async (tx) => {
      const workout = await tx.workout.create({
        data: {
          userId: userId,
          name: dto.name,
          description: dto.description,
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

      return workout;
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

  async update(id: number, dto: UpdateWorkoutDto) {
    return await prisma.$transaction(async (tx) => {
      // Uppdatera workout
      await tx.workout.update({
        where: {
          id,
        },
        data: {
          name: dto.name,
          description: dto.description,
        },
      });

      // Ta bort alla gamla övningar
      await tx.workoutExercise.deleteMany({
        where: {
          workoutId: id,
        },
      });

      // Lägg till de nya
      let order = 1;

      for (const exercise of dto.workoutExercises) {
        await tx.workoutExercise.create({
          data: {
            workoutId: id,
            exerciseId: exercise.exerciseId,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            note: exercise.note,
            order,
          },
        });

        order++;
      }
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

  async delete(id: number) {
    return await prisma.workout.delete({
      where: {
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
