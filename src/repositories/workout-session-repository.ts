import { prisma } from '@/lib/prisma';
import { WorkoutRepository } from './workout-repository';

export class WorkoutSessionRepository {
  private workoutRepository = new WorkoutRepository();
  async create(userId: number, workoutId: number) {
    const workout = await this.workoutRepository.getById(workoutId);

    if (!workout) {
      throw new Error('Workout hittades inte.');
    }

    if (workout.exercises.length === 0) {
      throw new Error('Workout innehåller inga övningar.');
    }

    return await prisma.$transaction(async (tx) => {
      const workoutSession = await tx.workoutSession.create({
        data: {
          userId,
          workoutId,
        },
      });

      for (const workoutExercise of workout.exercises) {
        const sessionExercise = await tx.workoutSessionExercise.create({
          data: {
            workoutSessionId: workoutSession.id,
            workoutExerciseId: workoutExercise.id,
            order: workoutExercise.order,
          },
        });

        for (let setNumber = 1; setNumber <= workoutExercise.sets; setNumber++) {
          await tx.workoutSessionSet.create({
            data: {
              workoutSessionExerciseId: sessionExercise.id,
              setNumber,

              targetReps: workoutExercise.reps,
              targetWeight: workoutExercise.weight,

              actualReps: null,
              actualWeight: null,
            },
          });
        }
      }

      return workoutSession;
    });
  }

  async getById(id: number) {
    return await prisma.workoutSession.findFirst({
      where: {
        id,
      },
      include: {
        exercises: {
          orderBy: {
            order: 'asc',
          },
          include: {
            workoutExercise: {
              include: {
                exercise: true,
              },
            },
            sets: {
              orderBy: {
                setNumber: 'asc',
              },
            },
          },
        },
      },
    });
  }

  async updateSet(id: number, actualReps: number, actualWeight: number) {
    return await prisma.workoutSessionSet.update({
      where: {
        id,
      },
      data: {
        actualReps,
        actualWeight,
        completed: true,
      },
    });
  }
}
