const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const columns = await prisma.$queryRaw`
    SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'workoutsession'
      AND COLUMN_NAME = 'activeKey'
  `;

  const indexes = await prisma.$queryRaw`
    SELECT INDEX_NAME, COLUMN_NAME, NON_UNIQUE
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'workoutsession'
      AND COLUMN_NAME = 'activeKey'
  `;

  console.log("ACTIVE KEY COLUMN:");
  console.table(columns);
  console.log("ACTIVE KEY INDEX:");
  console.table(indexes);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
