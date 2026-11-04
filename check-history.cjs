const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('MIGRATIONS');

  console.table(
    await prisma.$queryRawUnsafe(`
      SELECT migration_name, finished_at, rolled_back_at
      FROM _prisma_migrations
      WHERE migration_name LIKE '20261104%'
    `),
  );

  console.log('WORKOUT SNAPSHOTS');

  console.table(
    await prisma.$queryRawUnsafe(`
      SELECT
        COUNT(*) AS total,
        SUM(workoutName IS NULL OR workoutName = '') AS missing_names
      FROM workoutsession
    `),
  );

  console.log('EXERCISE SNAPSHOTS');

  console.table(
    await prisma.$queryRawUnsafe(`
      SELECT
        COUNT(*) AS total,
        SUM(
          exerciseName IS NULL OR exerciseName = ''
          OR exerciseDescription IS NULL
          OR exerciseInstructions IS NULL
          OR primaryMuscle IS NULL
          OR secondaryMuscles IS NULL
        ) AS incomplete_snapshots
      FROM workoutsessionexercise
    `),
  );

  console.log('SNAPSHOT DETAILS');

  console.table(
    await prisma.$queryRawUnsafe(`
      SELECT
        ws.id AS sessionId,
        ws.workoutName,
        wse.exerciseName,
        wse.exerciseEquipment,
        wse.primaryMuscle,
        wse.secondaryMuscles
      FROM workoutsession ws
      INNER JOIN workoutsessionexercise wse
        ON wse.workoutSessionId = ws.id
      ORDER BY ws.id, wse.order
      LIMIT 10
    `),
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
