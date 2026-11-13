import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

import type { CreateProductDto, UpdateProductDto } from '@/schemas/product-schema';

// --------------------------------------------------
// Prisma result types
// --------------------------------------------------

type Product = Prisma.ProductGetPayload<Record<string, never>>;

type CreateProductData = CreateProductDto & {
  slug: string;
  verifiedAt: Date | null;
};

type UpdateProductData = UpdateProductDto & {
  slug?: string;
  verifiedAt?: Date | null;
};

type ProductFilters = {
  search?: string;
  category?: string;
  quality?: 'VERIFIED' | 'STANDARD' | 'UNVERIFIED';
  archived?: boolean;
};

// --------------------------------------------------
// Repository
// --------------------------------------------------

export class ProductRepository {
  private buildWhere(filters: ProductFilters): Prisma.ProductWhereInput {
    const normalizedSearch = filters.search?.trim();

    return {
      archivedAt: filters.archived ? { not: null } : null,
      ...(filters.category && { category: filters.category }),
      ...(filters.quality && { dataQuality: filters.quality }),
      ...(normalizedSearch && {
        OR: [{ name: { contains: normalizedSearch } }, { brand: { contains: normalizedSearch } }, { barcode: { contains: normalizedSearch } }],
      }),
    };
  }

  async getAll(search?: string, category?: string, quality?: 'VERIFIED' | 'STANDARD' | 'UNVERIFIED', archived?: boolean, pagination?: { skip: number; take: number }): Promise<Product[]> {
    return prisma.product.findMany({
      where: this.buildWhere({ search, category, quality, archived }),
      orderBy: { name: 'asc' },
      ...(pagination && {
        skip: pagination.skip,
        take: pagination.take,
      }),
    });
  }

  async count(filters: ProductFilters): Promise<number> {
    return prisma.product.count({
      where: this.buildWhere(filters),
    });
  }

  async getById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async getBySlug(slug: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { slug },
    });
  }

  async getByBarcode(barcode: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { barcode },
    });
  }

  async create(data: CreateProductData): Promise<Product> {
    return prisma.product.create({
      data: {
        slug: data.slug,
        name: data.name,
        brand: data.brand || null,
        barcode: data.barcode || null,
        category: data.category || null,
        imageUrl: data.imageUrl || null,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        dataQuality: data.dataQuality,
        nutritionSource: data.nutritionSource || null,
        verifiedAt: data.verifiedAt,
      },
    });
  }

  async update(id: number, data: UpdateProductData): Promise<Product | null> {
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return null;
    }

    const updateData: Prisma.ProductUpdateInput = {
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.brand !== undefined && { brand: data.brand || null }),
      ...(data.barcode !== undefined && { barcode: data.barcode || null }),
      ...(data.category !== undefined && { category: data.category || null }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
      ...(data.calories !== undefined && { calories: data.calories }),
      ...(data.protein !== undefined && { protein: data.protein }),
      ...(data.carbs !== undefined && { carbs: data.carbs }),
      ...(data.fat !== undefined && { fat: data.fat }),
      ...(data.dataQuality !== undefined && {
        dataQuality: data.dataQuality,
      }),
      ...(data.nutritionSource !== undefined && {
        nutritionSource: data.nutritionSource || null,
      }),
      ...(data.verifiedAt !== undefined && {
        verifiedAt: data.verifiedAt,
      }),
    };

    return prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: number): Promise<Product | null> {
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return null;
    }

    return prisma.product.delete({
      where: { id },
    });
  }

  async archive(id: number): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { archivedAt: new Date() },
    });
  }

  async restore(id: number): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { archivedAt: null },
    });
  }

  async hasMealItems(productId: number): Promise<boolean> {
    const count = await prisma.mealItem.count({
      where: {
        productId,
      },
    });

    return count > 0;
  }
}
