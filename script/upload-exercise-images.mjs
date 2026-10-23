import { put } from '@vercel/blob';
import { loadEnvFile } from 'node:process';
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

loadEnvFile('.env.local');

const token = process.env.BLOB_READ_WRITE_TOKEN;
const sourceDirectory = path.resolve('public/exercises');
const outputFile = path.resolve('script/exercise-image-mapping.json');

const supportedExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.svg']);

const contentTypes = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
};

async function getImages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await getImages(fullPath)));
    } else if (entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN saknas i .env.local');
  }

  const files = await getImages(sourceDirectory);

  if (files.length === 0) {
    console.log('Inga bilder hittades i public/exercises.');
    return;
  }

  console.log(`${files.length} bilder hittades.`);

  const mapping = [];
  const errors = [];

  for (const file of files) {
    const relativePath = path.relative(sourceDirectory, file);
    const blobPath = `exercises/${relativePath.split(path.sep).join('/')}`;
    const extension = path.extname(file).toLowerCase();

    try {
      const blob = await put(blobPath, await import('node:fs/promises').then(({ readFile }) => readFile(file)), {
        access: 'public',
        token,
        contentType: contentTypes[extension],
        addRandomSuffix: false,
        allowOverwrite: true,
      });

      mapping.push({
        relativePath: relativePath.split(path.sep).join('/'),
        blobPath,
        url: blob.url,
      });

      console.log(`OK: ${relativePath}`);
    } catch (error) {
      errors.push({
        relativePath,
        error: error.message,
      });

      console.error(`FEL: ${relativePath} – ${error.message}`);
    }
  }

  await writeFile(outputFile, JSON.stringify({ uploaded: mapping, errors }, null, 2), 'utf8');

  console.log(`\nUppladdade: ${mapping.length}/${files.length}`);
  console.log(`Rapport: ${outputFile}`);

  if (errors.length > 0) {
    process.exitCode = 1;
    console.log('Vissa bilder misslyckades. Se rapporten innan du fortsätter.');
  } else {
    console.log('Alla bilder laddades upp. Kontrollera URL:erna innan databasen ändras.');
  }
}

main().catch((error) => {
  console.error('Migreringen misslyckades:', error.message);
  process.exitCode = 1;
});
