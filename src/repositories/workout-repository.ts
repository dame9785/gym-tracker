//Types
import { EditWorkoutDto, RegisterWorkoutDto } from '@/types/workout-types';

//Prisma
import { prisma } from '@/lib/prisma';

export class WorkoutRepository {
  async create(dto: RegisterWorkoutDto) {
    return await prisma.$transaction(async (tx) => {
      const workout = await tx.workout.create({
        data: {
          userId: 1,
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
            order,
          },
        });

        order++;
      }

      return workout;
    });
  }

  async getAll() {
    return await prisma.workout.findMany({
      where: {
        userId: 1,
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
    });
  }

  async update(id: number, dto: EditWorkoutDto) {
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

  async getById(id: number) {
    return await prisma.workout.findFirst({
      where: {
        id,
        userId: 1, // Tillfälligt tills vi använder inloggad användare
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
}
