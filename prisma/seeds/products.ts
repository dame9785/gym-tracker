import { PrismaClient, ProductDataQuality } from '@prisma/client';

const prisma = new PrismaClient();

// --------------------------------------------------
// DTO
// --------------------------------------------------

type ProductSeed = {
  slug: string;
  name: string;
  brand?: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  dataQuality: ProductDataQuality;
  nutritionSource: string;
};

// --------------------------------------------------
// PRODUCTS
// --------------------------------------------------

const products: ProductSeed[] = [
  // ================================================
  // ÄGG, KÖTT OCH FISK
  // ================================================

  {
    slug: 'agg-helt',
    name: 'Ägg, helt',
    category: 'Ägg',
    calories: 143,
    protein: 12.6,
    carbs: 0.7,
    fat: 9.5,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },
  {
    slug: 'garant-bacon-rokt-skivat',
    name: 'Bacon Rökt & Skivat',
    brand: 'Garant',
    category: 'Kött',
    calories: 260,
    protein: 17,
    carbs: 0,
    fat: 21,
    dataQuality: 'STANDARD',
    nutritionSource: 'Garant – officiell produktinformation, 140 g. Näringsvärde per 100 g.',
  },

  // ================================================
  // VEGETARISKT
  // ================================================

  {
    slug: 'felix-vegetariska-delikatessbullar',
    name: 'Vegetariska Delikatessbullar',
    brand: 'Felix',
    category: 'Vegetariskt',
    calories: 210,
    protein: 11,
    carbs: 8.7,
    fat: 13,
    dataQuality: 'STANDARD',
    nutritionSource: 'Felix officiell produktinformation – 340 g, näringsvärde per 100 g',
  },

  {
    slug: 'quorn-fileer-624g',
    name: 'Filéer',
    brand: 'Quorn',
    category: 'Vegetariskt',
    calories: 122,
    protein: 15,
    carbs: 5.8,
    fat: 2.8,
    dataQuality: 'STANDARD',
    nutritionSource: 'Coop – Quorn Filéer 624 g, EAN 5019503018912. Näringsvärde per 100 g.',
  },

  // ================================================
  // KOLHYDRATER
  // ================================================

  {
    slug: 'axa-havregryn',
    name: 'Havregryn',
    brand: 'AXA',
    category: 'Kolhydrater',
    calories: 367,
    protein: 13,
    carbs: 58,
    fat: 6.8,
    dataQuality: 'STANDARD',
    nutritionSource: 'Mathem – AXA Havregryn 1,5 kg, näringsvärde per 100 g',
  },

  // ================================================
  // GRÖNSAKER OCH FRUKT
  // ================================================
  {
    slug: 'eldorado-broccoli-buketter-frysta',
    name: 'Broccoli Buketter Frysta',
    brand: 'Eldorado',
    category: 'Grönsaker',
    calories: 39,
    protein: 4.4,
    carbs: 1.8,
    fat: 0.9,
    dataQuality: 'STANDARD',
    nutritionSource: 'Eldorado – officiell produktinformation, 1 kg. Näringsvärde per 100 g.',
  },

  {
    slug: 'pizzasallad',
    name: 'Pizzasallad',
    category: 'Grönsaker',
    calories: 88,
    protein: 0.9,
    carbs: 4.1,
    fat: 7.2,
    dataQuality: 'STANDARD',
    nutritionSource: 'Livsmedelsverket – Vitkålssallad pizzasallad. Generiskt näringsvärde per 100 g.',
  },

  // ================================================
  // MEJERI
  // ================================================

  {
    slug: 'arla-mild-kvarg-vanilj',
    name: 'Mild Kvarg Vanilj Utan Tillsatt Socker',
    brand: 'Arla',
    category: 'Mejeri',
    calories: 56,
    protein: 8.8,
    carbs: 4,
    fat: 0.2,
    dataQuality: 'STANDARD',
    nutritionSource: 'Mathem – Arla Mild Kvarg Vanilj Utan Tillsatt Socker 0,2%, 1000 g. Näringsvärde per 100 g.',
  },

  {
    slug: 'garant-bearnaisesas-klassisk',
    name: 'Bearnaisesås Klassisk',
    brand: 'Garant',
    category: 'Såser',
    calories: 600,
    protein: 0.5,
    carbs: 0.5,
    fat: 67,
    dataQuality: 'STANDARD',
    nutritionSource: 'Willys – Garant Bearnaisesås Klassisk 220 ml. Näringsvärde deklarerat per 100 ml, inte per 100 g.',
  },

  {
    slug: 'felix-appelmos',
    name: 'Äpplemos',
    brand: 'Felix',
    category: 'Sylt och mos',
    calories: 120,
    protein: 0,
    carbs: 28,
    fat: 0,
    dataQuality: 'STANDARD',
    nutritionSource: 'Orkla Foods Sverige / Dabas – Felix Äpplemos 750 g, artikelnummer 454005536, EAN 7310240055368. Näringsvärde per 100 g.',
  },
];

// --------------------------------------------------
// SEED
// --------------------------------------------------

async function seedProducts() {
  console.log('Starting product database upsert...');
  console.log(`Products to process: ${products.length}`);

  // Get existing products before processing
  const existingProducts = await prisma.product.findMany({
    where: {
      slug: {
        in: products.map((product) => product.slug),
      },
    },
    select: {
      slug: true,
    },
  });

  const existingSlugs = new Set(existingProducts.map((product) => product.slug));

  let created = 0;
  let updated = 0;

  // Process products individually without an interactive transaction
  for (const product of products) {
    await prisma.product.upsert({
      where: {
        slug: product.slug,
      },
      create: product,
      update: product,
    });

    if (existingSlugs.has(product.slug)) {
      updated++;
    } else {
      created++;
    }
  }

  const total = await prisma.product.count();

  console.log('');
  console.log('========================================');
  console.log('PRODUCT SEED COMPLETED');
  console.log('========================================');

  console.log(`Created products: ${created}`);
  console.log(`Updated products: ${updated}`);
  console.log(`Total products in database: ${total}`);

  console.log('========================================');
}

// --------------------------------------------------
// EXECUTION
// --------------------------------------------------

seedProducts()
  .catch((error) => {
    console.error('Product seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
