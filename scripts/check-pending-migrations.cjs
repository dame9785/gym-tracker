const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.$queryRaw`
    SELECT migration_name, started_at, finished_at, rolled_back_at, logs
    FROM _prisma_migrations
    WHERE finished_at IS NULL
  `;

  console.dir(rows, { depth: null });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
