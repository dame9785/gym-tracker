import { PrismaClient, ProductDataQuality } from '@prisma/client';

const prisma = new PrismaClient();

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

const products: ProductSeed[] = [
  // MEJERI
  {
    slug: 'kvarg-naturell',
    name: 'Kvarg naturell',
    category: 'Mejeri',
    calories: 65,
    protein: 11,
    carbs: 4,
    fat: 0.2,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },
  {
    slug: 'keso-naturell',
    name: 'Keso naturell',
    category: 'Mejeri',
    calories: 98,
    protein: 12,
    carbs: 2,
    fat: 4.3,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },
  {
    slug: 'mjolk-15',
    name: 'Mjölk 1,5%',
    category: 'Mejeri',
    calories: 46,
    protein: 3.5,
    carbs: 4.8,
    fat: 1.5,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },
  {
    slug: 'grekisk-yoghurt-10',
    name: 'Grekisk yoghurt 10%',
    category: 'Mejeri',
    calories: 120,
    protein: 4,
    carbs: 3.5,
    fat: 10,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },

  {
    slug: 'mjolk-05',
    name: 'Mjölk 0,5%',
    category: 'Mejeri',
    calories: 36,
    protein: 3.5,
    carbs: 4.8,
    fat: 0.5,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },
  {
    slug: 'standardmjolk-3',
    name: 'Standardmjölk 3%',
    category: 'Mejeri',
    calories: 60,
    protein: 3.4,
    carbs: 4.7,
    fat: 3,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },
  {
    slug: 'filmjolk-3',
    name: 'Filmjölk 3%',
    category: 'Mejeri',
    calories: 60,
    protein: 3.4,
    carbs: 4.5,
    fat: 3,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },
  {
    slug: 'naturell-yoghurt-3',
    name: 'Naturell yoghurt 3%',
    category: 'Mejeri',
    calories: 61,
    protein: 3.5,
    carbs: 4.7,
    fat: 3,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },
  {
    slug: 'graeddfil-12',
    name: 'Gräddfil 12%',
    category: 'Mejeri',
    calories: 135,
    protein: 3.2,
    carbs: 3.8,
    fat: 12,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },
  {
    slug: 'creme-fraiche-34',
    name: 'Crème fraîche 34%',
    category: 'Mejeri',
    calories: 330,
    protein: 2.2,
    carbs: 3,
    fat: 34,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },
  {
    slug: 'vispgradde-40',
    name: 'Vispgrädde 40%',
    category: 'Mejeri',
    calories: 376,
    protein: 2.1,
    carbs: 3,
    fat: 40,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },
  {
    slug: 'matlagningsgradde-15',
    name: 'Matlagningsgrädde 15%',
    category: 'Mejeri',
    calories: 160,
    protein: 3,
    carbs: 4,
    fat: 15,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },
  {
    slug: 'mozzarella',
    name: 'Mozzarella',
    category: 'Mejeri',
    calories: 280,
    protein: 18,
    carbs: 2,
    fat: 22,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – varierar mellan märken',
  },
  {
    slug: 'fetaost',
    name: 'Fetaost',
    category: 'Mejeri',
    calories: 265,
    protein: 14,
    carbs: 4,
    fat: 21,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – varierar mellan märken',
  },

  // ÄGG, KÖTT OCH FISK
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
    slug: 'bacon',
    name: 'Bacon',
    category: 'Kött',
    calories: 300,
    protein: 15,
    carbs: 0.5,
    fat: 26,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – varierar mellan märken',
  },
  {
    slug: 'kycklingfile-ra',
    name: 'Kycklingfilé, rå',
    category: 'Kött',
    calories: 110,
    protein: 23,
    carbs: 0,
    fat: 1.5,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },
  {
    slug: 'notfars-10',
    name: 'Nötfärs 10%',
    category: 'Kött',
    calories: 176,
    protein: 20,
    carbs: 0,
    fat: 10,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – varierar mellan märken',
  },
  {
    slug: 'lax-ra',
    name: 'Lax, rå',
    category: 'Fisk',
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },
  {
    slug: 'tonfisk-vatten-avrunnen',
    name: 'Tonfisk i vatten, avrunnen',
    category: 'Fisk',
    calories: 116,
    protein: 26,
    carbs: 0,
    fat: 1,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },

  // VEGETARISKT
  {
    slug: 'tofu-naturell',
    name: 'Tofu naturell',
    category: 'Vegetariskt',
    calories: 145,
    protein: 15,
    carbs: 1.5,
    fat: 9,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – varierar mellan märken',
  },
  {
    slug: 'halloumi',
    name: 'Halloumi',
    category: 'Vegetariskt',
    calories: 320,
    protein: 22,
    carbs: 2,
    fat: 25,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – varierar mellan märken',
  },
  {
    slug: 'quorn-fileer',
    name: 'Quorn filéer',
    category: 'Vegetariskt',
    calories: 95,
    protein: 14,
    carbs: 2,
    fat: 2,
    dataQuality: 'UNVERIFIED',
    nutritionSource: 'Produktvärde saknas – kontrollera förpackning',
  },
  {
    slug: 'vegetariska-corn-bites',
    name: 'Vegetariska corn bites',
    category: 'Vegetariskt',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    dataQuality: 'UNVERIFIED',
    nutritionSource: 'Näringsvärden saknas – kontrollera förpackning',
  },
  {
    slug: 'vegetariska-corn-fillets',
    name: 'Vegetariska corn fillets',
    category: 'Vegetariskt',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    dataQuality: 'UNVERIFIED',
    nutritionSource: 'Näringsvärden saknas – kontrollera förpackning',
  },

  // KOLHYDRATER
  {
    slug: 'havregryn',
    name: 'Havregryn',
    category: 'Kolhydrater',
    calories: 370,
    protein: 13,
    carbs: 58,
    fat: 7,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },

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

  {
    slug: 'ris-okokt',
    name: 'Ris, okokt',
    category: 'Kolhydrater',
    calories: 360,
    protein: 7,
    carbs: 79,
    fat: 0.7,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – varierar mellan sorter',
  },
  {
    slug: 'pasta-okokt',
    name: 'Pasta, okokt',
    category: 'Kolhydrater',
    calories: 350,
    protein: 12,
    carbs: 70,
    fat: 1.5,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – varierar mellan sorter',
  },
  {
    slug: 'potatis-ra',
    name: 'Potatis, rå',
    category: 'Kolhydrater',
    calories: 77,
    protein: 2,
    carbs: 17,
    fat: 0.1,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },

  // GRÖNSAKER OCH FRUKT
  {
    slug: 'broccoli-ra',
    name: 'Broccoli, rå',
    category: 'Grönsaker',
    calories: 34,
    protein: 2.8,
    carbs: 6.6,
    fat: 0.4,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },
  {
    slug: 'morot-ra',
    name: 'Morot, rå',
    category: 'Grönsaker',
    calories: 41,
    protein: 0.9,
    carbs: 9.6,
    fat: 0.2,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },
  {
    slug: 'banan',
    name: 'Banan',
    category: 'Frukt',
    calories: 89,
    protein: 1.1,
    carbs: 22.8,
    fat: 0.3,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – behöver verifieras',
  },

  // FETT OCH TILLBEHÖR
  {
    slug: 'olivolja',
    name: 'Olivolja',
    category: 'Fett',
    calories: 884,
    protein: 0,
    carbs: 0,
    fat: 100,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde',
  },
  {
    slug: 'smor',
    name: 'Smör',
    category: 'Fett',
    calories: 717,
    protein: 0.9,
    carbs: 0.1,
    fat: 81,
    dataQuality: 'STANDARD',
    nutritionSource: 'Generiskt standardvärde – varierar mellan märken',
  },
  {
    slug: 'arla-mild-kvarg-vanilj',
    name: 'Mild Kvarg Vanilj Utan Tillsatt Socker 0,2%',
    brand: 'Arla',
    category: 'Mejeri',
    calories: 56,
    protein: 8.8,
    carbs: 4,
    fat: 0.2,
    dataQuality: 'STANDARD',
    nutritionSource: 'Arla Foods AB – Mathem product information (1000 g)',
  },
];

async function seedProducts() {
  let created = 0;
  let updated = 0;

  for (const product of products) {
    const existing = await prisma.product.findUnique({
      where: { slug: product.slug },
      select: { id: true },
    });

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });

    if (existing) {
      updated++;
    } else {
      created++;
    }
  }

  console.log('Product seeding completed.');
  console.log(`Created: ${created}`);
  console.log(`Updated: ${updated}`);
  console.log(`Total processed: ${products.length}`);
}

seedProducts()
  .catch((error) => {
    console.error('Product seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
