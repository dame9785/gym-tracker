import { ProductDataQuality } from '@prisma/client';

import { createSlug } from '@/lib/slug';
import { ProductRepository } from '@/repositories/product-repository';

import type { CreateProductDto, UpdateProductDto } from '@/schemas/product-schema';

// --------------------------------------------------
// Service
// --------------------------------------------------

export class ProductService {
  constructor(private readonly productRepository = new ProductRepository()) {}

  async getPaginated(search: string | undefined, category: string | undefined, quality: 'VERIFIED' | 'STANDARD' | 'UNVERIFIED' | undefined, archived: boolean, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const [products, totalProducts] = await Promise.all([
      this.productRepository.getAll(search, category, quality, archived, { skip, take: pageSize }),
      this.productRepository.count({
        search,
        category,
        quality,
        archived,
      }),
    ]);

    return {
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / pageSize),
      currentPage: page,
    };
  }

  async getAll(search?: string, category?: string, quality?: 'VERIFIED' | 'STANDARD' | 'UNVERIFIED', archived?: boolean) {
    return this.productRepository.getAll(search, category, quality, archived);
  }

  async getById(id: number) {
    return this.productRepository.getById(id);
  }

  async getBySlug(slug: string) {
    return this.productRepository.getBySlug(slug);
  }

  async getByBarcode(barcode: string) {
    return this.productRepository.getByBarcode(barcode);
  }

  async create(dto: CreateProductDto) {
    // Kontrollera streckkod
    if (dto.barcode) {
      const existingBarcode = await this.productRepository.getByBarcode(dto.barcode);

      if (existingBarcode) {
        throw new Error('A product with this barcode already exists.');
      }
    }

    // Generera en unik slug
    const baseSlug = createSlug(dto.name);

    if (!baseSlug) {
      throw new Error('Could not generate a valid product slug.');
    }

    const slug = await this.generateUniqueSlug(baseSlug);

    // Kontrollera datakvalitet
    if (dto.dataQuality === ProductDataQuality.VERIFIED && !dto.nutritionSource?.trim()) {
      throw new Error('A nutrition source is required for verified products.');
    }

    return this.productRepository.create({
      ...dto,
      slug,
      verifiedAt: dto.dataQuality === ProductDataQuality.VERIFIED ? new Date() : null,
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    const existing = await this.productRepository.getById(id);

    if (!existing) {
      throw new Error('Product not found.');
    }

    // Kontrollera eventuell ny streckkod
    if (dto.barcode) {
      const existingBarcode = await this.productRepository.getByBarcode(dto.barcode);

      if (existingBarcode && existingBarcode.id !== id) {
        throw new Error('A product with this barcode already exists.');
      }
    }

    // Kontrollera datakvalitet
    const nextQuality = dto.dataQuality ?? existing.dataQuality;
    const nextSource = dto.nutritionSource ?? existing.nutritionSource;

    if (nextQuality === ProductDataQuality.VERIFIED && !nextSource?.trim()) {
      throw new Error('A nutrition source is required for verified products.');
    }

    // Uppdatera slug om produktnamnet ändras
    let slug: string | undefined;

    if (dto.name && dto.name !== existing.name) {
      const baseSlug = createSlug(dto.name);

      if (!baseSlug) {
        throw new Error('Could not generate a valid product slug.');
      }

      slug = await this.generateUniqueSlug(baseSlug, id);
    }

    // Hantera verifieringsdatum
    let verifiedAt: Date | null | undefined;

    if (nextQuality === ProductDataQuality.VERIFIED) {
      verifiedAt = existing.dataQuality === ProductDataQuality.VERIFIED ? (existing.verifiedAt ?? new Date()) : new Date();
    } else {
      verifiedAt = null;
    }

    const updatedProduct = await this.productRepository.update(id, {
      ...dto,
      ...(slug && { slug }),
      verifiedAt,
    });

    if (!updatedProduct) {
      throw new Error('Product not found.');
    }

    return updatedProduct;
  }

  async delete(id: number) {
    const existing = await this.productRepository.getById(id);

    if (!existing) {
      throw new Error('Product not found.');
    }

    const isUsed = await this.productRepository.hasMealItems(id);

    if (isUsed) {
      throw new Error('This product cannot be deleted because it is used in meal records. Archive it instead.');
    }

    return this.productRepository.delete(id);
  }

  // --------------------------------------------------
  // Private helpers
  // --------------------------------------------------

  private async generateUniqueSlug(baseSlug: string, excludeId?: number): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.productRepository.getBySlug(slug);

      if (!existing || existing.id === excludeId) {
        return slug;
      }

      counter++;
      slug = `${baseSlug}-${counter}`;
    }
  }

  async archive(id: number) {
    const existing = await this.productRepository.getById(id);

    if (!existing) {
      throw new Error('Product not found.');
    }

    if (existing.archivedAt) {
      throw new Error('Product is already archived.');
    }

    return this.productRepository.archive(id);
  }

  async restore(id: number) {
    const existing = await this.productRepository.getById(id);

    if (!existing) {
      throw new Error('Product not found.');
    }

    if (!existing.archivedAt) {
      throw new Error('Product is not archived.');
    }

    return this.productRepository.restore(id);
  }
}
