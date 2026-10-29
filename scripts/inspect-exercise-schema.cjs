const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const columns = await prisma.$queryRaw`
    SELECT COLUMN_NAME, IS_NULLABLE, COLUMN_TYPE
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'exercise'
    ORDER BY ORDINAL_POSITION
  `;

  const relations = await prisma.$queryRaw`
    SELECT TABLE_NAME, CONSTRAINT_NAME, COLUMN_NAME,
           REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME IN ('exercisemuscle', 'musclegroup')
      AND REFERENCED_TABLE_NAME IS NOT NULL
  `;

  console.log("EXERCISE COLUMNS:");
  console.table(columns);
  console.log("MUSCLE RELATION FOREIGN KEYS:");
  console.table(relations);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
