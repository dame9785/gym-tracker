const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const tables = await prisma.$queryRaw`
    SELECT TABLE_NAME
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME IN (
        'Exercise',
        'MuscleGroup',
        'ExerciseMuscle',
        'weightlog'
      )
  `;

  const columns = await prisma.$queryRaw`
    SELECT TABLE_NAME, COLUMN_NAME
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND (
        (TABLE_NAME = 'Exercise' AND COLUMN_NAME IN ('slug', 'muscleGroup'))
        OR (TABLE_NAME = 'weightlog' AND COLUMN_NAME = 'userId')
      )
  `;

  const indexes = await prisma.$queryRaw`
    SELECT TABLE_NAME, INDEX_NAME, COLUMN_NAME
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'weightlog'
  `;

  console.log("TABLES:");
  console.table(tables);
  console.log("COLUMNS:");
  console.table(columns);
  console.log("WEIGHTLOG INDEXES:");
  console.table(indexes);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
