import { prisma } from '@/lib/prisma';
import { RegisterWorkoutDto } from '@/dto/register-workout-dto';

export class WorkoutRepository {
  async create(dto: RegisterWorkoutDto) {
    return await prisma.$transaction(async (tx) => {
      const workout = await tx.workout.create({
        data: {
          userId: 15,
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
            restSeconds: exercise.rest,
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
        userId: 15, // Tillfälligt tills vi använder inloggad användare
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getById(id: number) {
    return await prisma.workout.findFirst({
      where: {
        id,
        userId: 15, // Tillfälligt tills vi använder inloggad användare
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
}
