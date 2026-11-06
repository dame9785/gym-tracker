import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sessions = await prisma.workoutSession.findMany({
    where: {
      userId: 1,
      startedAt: {
        gte: new Date('2026-11-03T00:00:00+01:00'),
        lt: new Date('2026-11-07T00:00:00+01:00'),
      },
    },
    include: {
      workout: {
        select: { name: true },
      },
      exercises: {
        select: {
          exerciseName: true,
          sets: {
            select: {
              setNumber: true,
              targetWeight: true,
              actualWeight: true,
              completed: true,
            },
          },
        },
      },
    },
    orderBy: {
      startedAt: 'asc',
    },
  });

  console.log('Found sessions:', sessions.length);

  for (const session of sessions) {
    console.log('----------------------------');
    console.log('Session ID:', session.id);
    console.log('Workout:', session.workoutName);
    console.log('Started:', session.startedAt.toISOString());
    console.log('Finished:', session.finishedAt);
    console.log('Status:', session.status);
    console.log('Exercises:', session.exercises.length);

    for (const exercise of session.exercises) {
      console.log('Exercise:', exercise.exerciseName);

      for (const set of exercise.sets) {
        console.log({
          set: set.setNumber,
          targetWeight: set.targetWeight,
          actualWeight: set.actualWeight,
          completed: set.completed,
        });
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
