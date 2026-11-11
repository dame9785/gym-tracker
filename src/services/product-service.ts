import { ProductRepository } from '@/repositories/product-repository';

const MIN_SEARCH_LENGTH = 2;
const MAX_SEARCH_LENGTH = 100;

export class ProductService {
  constructor(private readonly productRepository = new ProductRepository()) {}

  /**
   * Search shared branded products.
   */
  async searchProducts(query: string) {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < MIN_SEARCH_LENGTH || normalizedQuery.length > MAX_SEARCH_LENGTH) {
      return [];
    }

    return this.productRepository.searchProducts(normalizedQuery);
  }

  /**
   * Get a shared product by ID.
   */
  async getProductById(productId: number) {
    this.validateProductId(productId);

    return this.productRepository.getProductById(productId);
  }

  /**
   * Get a shared product by barcode.
   */
  async getProductByBarcode(barcode: string) {
    const normalizedBarcode = barcode.trim();

    if (!normalizedBarcode || normalizedBarcode.length > 64) {
      throw new Error('Invalid product barcode.');
    }

    return this.productRepository.getProductByBarcode(normalizedBarcode);
  }

  /**
   * Get all shared products.
   */
  async getAllProducts() {
    return this.productRepository.getAllProducts();
  }

  /**
   * Create a shared branded product.
   */
  async createProduct(product: { name: string; brand: string; barcode?: string | null; category?: string | null; imageUrl?: string | null; caloriesPer100g: number; proteinPer100g: number; carbsPer100g: number; fatPer100g: number; sourceUrl?: string | null; verifiedAt?: Date | null }) {
    const name = product.name.trim();
    const brand = product.brand.trim();

    if (!name || name.length > 191) {
      throw new Error('Invalid product name.');
    }

    if (!brand || brand.length > 191) {
      throw new Error('Invalid product brand.');
    }

    const barcode = product.barcode?.trim() || null;

    if (barcode && barcode.length > 64) {
      throw new Error('Invalid product barcode.');
    }

    const category = product.category?.trim() || null;

    if (category && category.length > 100) {
      throw new Error('Invalid product category.');
    }

    const nutrients = [product.caloriesPer100g, product.proteinPer100g, product.carbsPer100g, product.fatPer100g];

    if (nutrients.some((value) => !Number.isFinite(value) || value < 0 || value > 1000)) {
      throw new Error('Invalid nutritional values.');
    }

    if (product.verifiedAt && Number.isNaN(product.verifiedAt.getTime())) {
      throw new Error('Invalid verification date.');
    }

    return this.productRepository.createProduct({
      name,
      brand,
      barcode,
      category,
      imageUrl: product.imageUrl?.trim() || null,
      caloriesPer100g: product.caloriesPer100g,
      proteinPer100g: product.proteinPer100g,
      carbsPer100g: product.carbsPer100g,
      fatPer100g: product.fatPer100g,
      sourceUrl: product.sourceUrl?.trim() || null,
      verifiedAt: product.verifiedAt ?? null,
    });
  }

  /**
   * Validate product ID.
   */
  private validateProductId(productId: number): void {
    if (!Number.isInteger(productId) || productId <= 0) {
      throw new Error('Invalid product ID.');
    }
  }
}
