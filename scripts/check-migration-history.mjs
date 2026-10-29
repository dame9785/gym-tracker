import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  const result = await prisma.$queryRaw`
    SELECT migration_name, checksum, finished_at
    FROM _prisma_migrations
    WHERE migration_name IN (
      '20261025125139_add_exercise_muscle_relations',
      '20261026090000_add_exercise_slug'
    )
  `;

  console.table(result);
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
