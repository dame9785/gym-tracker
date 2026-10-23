import { PrismaClient } from '@prisma/client';
import { loadEnvFile } from 'node:process';

loadEnvFile('.env.local');

const prisma = new PrismaClient();

async function main() {
  const exercises = await prisma.exercise.findMany({
    select: {
      id: true,
      name: true,
      imagePath: true,
      userId: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  console.table(exercises);

  console.log(`Totalt antal övningar: ${exercises.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
