import { prisma } from '../src/lib/prisma';

async function main() {
  const testSessions = await prisma.workoutSession.findMany({
    where: {
      status: 'COMPLETED',
      workout: {
        name: {
          in: ['test1', 'test2', 'test 3'],
        },
      },
    },
    select: {
      id: true,
      workout: {
        select: {
          name: true,
        },
      },
      finishedAt: true,
    },
  });

  console.table(
    testSessions.map((session) => ({
      id: session.id,
      workout: session.workout.name,
      finishedAt: session.finishedAt,
    })),
  );

  if (testSessions.length !== 3) {
    throw new Error(`Förväntade 3 testpass men hittade ${testSessions.length}. Inga datum har ändrats.`);
  }

  const datesByName: Record<string, Date> = {
    test1: new Date('2026-10-25T10:00:00.000Z'),
    test2: new Date('2026-10-26T10:00:00.000Z'),
    'test 3': new Date('2026-10-27T10:00:00.000Z'),
  };

  await prisma.$transaction(
    testSessions.map((session) =>
      prisma.workoutSession.update({
        where: { id: session.id },
        data: {
          finishedAt: datesByName[session.workout.name],
        },
      }),
    ),
  );

  console.log('Testpassens datum har uppdaterats.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
