import { PrismaClient } from '@prisma/client';
import { loadEnvFile } from 'node:process';
import { readFile } from 'node:fs/promises';

loadEnvFile('.env.local');

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

async function main() {
  const reportPath = 'script/exercise-image-mapping.json';
  const report = JSON.parse(await readFile(reportPath, 'utf8'));
  const uploaded = report.uploaded ?? [];

  if (report.errors?.length) {
    throw new Error('Uppladdningsrapporten innehåller fel. Avbryter migreringen.');
  }

  if (uploaded.length !== 8) {
    throw new Error(`Förväntade 8 uppladdade bilder, hittade ${uploaded.length}.`);
  }

  const plans = [];
  const skipped = [];

  for (const image of uploaded) {
    const oldPath = `/exercises/${image.relativePath}`;
    const matches = await prisma.exercise.findMany({
      where: { imagePath: oldPath },
      select: { id: true, name: true, imagePath: true, userId: true },
    });

    if (matches.length !== 1) {
      skipped.push({
        oldPath,
        reason: `Hittade ${matches.length} matchande övningar`,
      });
      continue;
    }

    plans.push({
      id: matches[0].id,
      userId: matches[0].userId,
      name: matches[0].name,
      oldPath,
      newUrl: image.url,
    });
  }

  console.log('\nPlanerade ändringar:');
  console.table(
    plans.map(({ id, name, oldPath, newUrl }) => ({
      id,
      name,
      oldPath,
      newUrl,
    })),
  );

  if (skipped.length) {
    console.log('\nÖvningar som inte matchades:');
    console.table(skipped);
  }

  if (!APPLY) {
    console.log('\nKontrolläge: databasen är oförändrad.');
    console.log('Granska matchningarna. Kör med --apply när de är korrekta.');
    return;
  }

  if (skipped.length || plans.length !== 8) {
    throw new Error('Alla 8 bilder måste matchas entydigt innan databasen uppdateras.');
  }

  await prisma.$transaction(async (tx) => {
    for (const plan of plans) {
      const result = await tx.exercise.updateMany({
        where: {
          id: plan.id,
          userId: plan.userId,
          imagePath: plan.oldPath,
        },
        data: {
          imagePath: plan.newUrl,
        },
      });

      if (result.count !== 1) {
        throw new Error(`Kunde inte uppdatera övning ${plan.id}. Transaktionen avbryts.`);
      }
    }
  });

  console.log('\nKlart! Alla 8 bildsökvägar har uppdaterats.');
}

main()
  .catch((error) => {
    console.error('Migreringen misslyckades:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
