import { PrismaClient } from '@prisma/client';
import { parse } from 'dotenv';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type ProductInput = {
  name: string;
  brand: string;
  barcode: string;
  category?: string | null;
  imageUrl?: string | null;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  sourceUrl: string;
  verifiedAt: string;
};

function readDatabaseUrl(fileName: string): string {
  const filePath = resolve(process.cwd(), fileName);
  const content = readFileSync(filePath, 'utf8');
  const variables = parse(content);
  const databaseUrl = variables.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(`DATABASE_URL missing in ${fileName}`);
  }

  return databaseUrl;
}

function loadProducts(): ProductInput[] {
  const filePath = resolve(process.cwd(), 'scripts/products/data/products.json');

  const content = readFileSync(filePath, 'utf8');
  const products: unknown = JSON.parse(content);

  if (!Array.isArray(products)) {
    throw new Error('Product data must be a JSON array.');
  }

  const barcodes = new Set<string>();

  for (const product of products) {
    validateProduct(product);

    if (barcodes.has(product.barcode)) {
      throw new Error(`Duplicate barcode in JSON: ${product.barcode}`);
    }

    barcodes.add(product.barcode);
  }

  return products;
}

function validateProduct(product: ProductInput): void {
  if (!product || typeof product.name !== 'string' || !product.name.trim() || product.name.length > 191) {
    throw new Error('Invalid product name.');
  }

  if (typeof product.brand !== 'string' || !product.brand.trim() || product.brand.length > 191) {
    throw new Error(`Invalid brand for product: ${product.name}`);
  }

  if (typeof product.barcode !== 'string' || !/^\d{8,14}$/.test(product.barcode)) {
    throw new Error(`Invalid barcode for product: ${product.name}`);
  }

  const nutrients = [product.caloriesPer100g, product.proteinPer100g, product.carbsPer100g, product.fatPer100g];

  if (nutrients.some((value) => typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1000)) {
    throw new Error(`Invalid nutritional values: ${product.name}`);
  }

  if (typeof product.sourceUrl !== 'string' || !product.sourceUrl.trim() || !URL.canParse(product.sourceUrl)) {
    throw new Error(`Invalid source URL: ${product.name}`);
  }

  if (typeof product.verifiedAt !== 'string' || Number.isNaN(Date.parse(product.verifiedAt))) {
    throw new Error(`Invalid verification date: ${product.name}`);
  }
}

async function importProducts(databaseName: string, databaseUrl: string, products: ProductInput[]) {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  let imported = 0;
  let failed = 0;

  try {
    for (const product of products) {
      try {
        await prisma.product.upsert({
          where: {
            barcode: product.barcode,
          },
          create: {
            name: product.name.trim(),
            brand: product.brand.trim(),
            barcode: product.barcode,
            category: product.category ?? null,
            imageUrl: product.imageUrl ?? null,
            caloriesPer100g: product.caloriesPer100g,
            proteinPer100g: product.proteinPer100g,
            carbsPer100g: product.carbsPer100g,
            fatPer100g: product.fatPer100g,
            sourceUrl: product.sourceUrl,
            verifiedAt: new Date(product.verifiedAt),
          },
          update: {
            name: product.name.trim(),
            brand: product.brand.trim(),
            category: product.category ?? null,
            imageUrl: product.imageUrl ?? null,
            caloriesPer100g: product.caloriesPer100g,
            proteinPer100g: product.proteinPer100g,
            carbsPer100g: product.carbsPer100g,
            fatPer100g: product.fatPer100g,
            sourceUrl: product.sourceUrl,
            verifiedAt: new Date(product.verifiedAt),
          },
        });

        imported++;
      } catch (error) {
        failed++;
        console.error(`Failed: ${product.name} (${product.barcode})`, error);
      }
    }

    console.log(`\n${databaseName}`);
    console.log(`Imported/updated: ${imported}`);
    console.log(`Failed: ${failed}`);

    return failed === 0;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  console.log('Loading product data...');

  const products = loadProducts();

  console.log(`Validated ${products.length} products.`);

  if (products.length === 0) {
    console.log('No products to import.');
    return;
  }

  const localUrl = readDatabaseUrl('.env');
  const cloudUrl = readDatabaseUrl('.env.production.local');

  console.log('\nStarting local database import...');

  const localSuccess = await importProducts('LOCAL MYSQL', localUrl, products);

  console.log('\nStarting TiDB Cloud import...');

  const cloudSuccess = await importProducts('TIDB CLOUD', cloudUrl, products);

  if (!localSuccess || !cloudSuccess) {
    throw new Error('Some products failed to import.');
  }

  console.log('\nProduct import completed successfully!');
}

main().catch((error) => {
  console.error('\nProduct import failed:', error);
  process.exitCode = 1;
});
