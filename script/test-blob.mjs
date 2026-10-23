import { put } from '@vercel/blob';

process.loadEnvFile('.env.local');

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN saknas i .env.local');
  }

  const blob = await put('test/gymtracker-test.txt', 'GymTracker Blob fungerar!', {
    access: 'public',
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  console.log('Uppladdningen lyckades!');
  console.log('Testfilens URL:', blob.url);
}

main().catch((error) => {
  console.error('Blob-testet misslyckades:', error.message);
  process.exitCode = 1;
});
