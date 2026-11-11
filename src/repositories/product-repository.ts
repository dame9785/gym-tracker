import { prisma } from '@/lib/prisma';

export class ProductRepository {
  /**
   * Search shared branded products by name or brand.
   */
  async searchProducts(query: string) {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return [];
    }

    return prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: normalizedQuery,
            },
          },
          {
            brand: {
              contains: normalizedQuery,
            },
          },
          {
            barcode: normalizedQuery,
          },
        ],
      },
      orderBy: {
        name: 'asc',
      },
      take: 20,
    });
  }

  /**
   * Get a shared product by ID.
   */
  async getProductById(productId: number) {
    return prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
  }

  /**
   * Get a shared product by barcode.
   */
  async getProductByBarcode(barcode: string) {
    return prisma.product.findUnique({
      where: {
        barcode,
      },
    });
  }

  /**
   * Get all shared products.
   */
  async getAllProducts() {
    return prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Create a shared branded product.
   */
  async createProduct(product: { name: string; brand: string; barcode?: string | null; category?: string | null; imageUrl?: string | null; caloriesPer100g: number; proteinPer100g: number; carbsPer100g: number; fatPer100g: number; sourceUrl?: string | null; verifiedAt?: Date | null }) {
    return prisma.product.create({
      data: {
        name: product.name,
        brand: product.brand,
        barcode: product.barcode ?? null,
        category: product.category ?? null,
        imageUrl: product.imageUrl ?? null,
        caloriesPer100g: product.caloriesPer100g,
        proteinPer100g: product.proteinPer100g,
        carbsPer100g: product.carbsPer100g,
        fatPer100g: product.fatPer100g,
        sourceUrl: product.sourceUrl ?? null,
        verifiedAt: product.verifiedAt ?? null,
      },
    });
  }
}
