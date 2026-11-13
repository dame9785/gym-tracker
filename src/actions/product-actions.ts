'use server';

import type { Prisma } from '@prisma/client';

import { requireAuth, requireAdmin } from '@/lib/auth';
import { ProductService } from '@/services/product-service';

import { createProductSchema, updateProductSchema } from '@/schemas/product-schema';

import type { AppActionResult } from '@/types/action-types';

import { isValidId } from '@/utils/validation';
import { getActionErrorMessage, getActionValidationErrors } from '@/utils/action-error';

// --------------------------------------------------
// Types
// --------------------------------------------------

type Product = Prisma.ProductGetPayload<Record<string, never>>;

type ProductViewModel = Omit<Product, 'calories' | 'protein' | 'carbs' | 'fat'> & {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

// --------------------------------------------------
// Service
// --------------------------------------------------

const productService = new ProductService();

// --------------------------------------------------
// Mapper
// --------------------------------------------------

function mapProduct(product: Product): ProductViewModel {
  return {
    ...product,
    calories: Number(product.calories),
    protein: Number(product.protein),
    carbs: Number(product.carbs),
    fat: Number(product.fat),
  };
}

// --------------------------------------------------
// Get products
// --------------------------------------------------

export async function getProductsAction(search?: string, category?: string): Promise<AppActionResult<ProductViewModel[]>> {
  await requireAuth();

  try {
    const products = await productService.getAll(search, category);

    return {
      success: true,
      data: products.map(mapProduct),
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

// --------------------------------------------------
// Get product by ID
// --------------------------------------------------

export async function getProductByIdAction(id: number): Promise<AppActionResult<ProductViewModel>> {
  await requireAuth();

  if (!isValidId(id)) {
    return {
      success: false,
      message: 'Invalid product ID.',
    };
  }

  try {
    const product = await productService.getById(id);

    if (!product) {
      return {
        success: false,
        message: 'Product not found.',
      };
    }

    return {
      success: true,
      data: mapProduct(product),
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

// --------------------------------------------------
// Get product by slug
// --------------------------------------------------

export async function getProductBySlugAction(slug: string): Promise<AppActionResult<ProductViewModel>> {
  await requireAuth();

  if (!slug.trim()) {
    return {
      success: false,
      message: 'Invalid product slug.',
    };
  }

  try {
    const product = await productService.getBySlug(slug);

    if (!product) {
      return {
        success: false,
        message: 'Product not found.',
      };
    }

    return {
      success: true,
      data: mapProduct(product),
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

// --------------------------------------------------
// Create product (ADMIN)
// --------------------------------------------------

export async function createProductAction(input: unknown): Promise<AppActionResult<ProductViewModel>> {
  await requireAdmin();

  try {
    const validation = createProductSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const product = await productService.create(validation.data);

    return {
      success: true,
      message: 'Product created successfully.',
      data: mapProduct(product),
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

// --------------------------------------------------
// Update product (ADMIN)
// --------------------------------------------------

export async function updateProductAction(id: number, input: unknown): Promise<AppActionResult<ProductViewModel>> {
  await requireAdmin();

  if (!isValidId(id)) {
    return {
      success: false,
      message: 'Invalid product ID.',
    };
  }

  try {
    const validation = updateProductSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const product = await productService.update(id, validation.data);

    return {
      success: true,
      message: 'Product updated successfully.',
      data: mapProduct(product),
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

// --------------------------------------------------
// Delete product (ADMIN)
// --------------------------------------------------

export async function deleteProductAction(id: number): Promise<AppActionResult> {
  await requireAdmin();

  if (!isValidId(id)) {
    return {
      success: false,
      message: 'Invalid product ID.',
    };
  }

  try {
    await productService.delete(id);

    return {
      success: true,
      message: 'Product deleted successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

// --------------------------------------------------
// Archive product (ADMIN)
// --------------------------------------------------

export async function archiveProductAction(id: number): Promise<AppActionResult<ProductViewModel>> {
  await requireAdmin();

  if (!isValidId(id)) {
    return {
      success: false,
      message: 'Invalid product ID.',
    };
  }

  try {
    const product = await productService.archive(id);

    return {
      success: true,
      message: 'Product archived successfully.',
      data: mapProduct(product),
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

// --------------------------------------------------
// Restore product (ADMIN)
// --------------------------------------------------

export async function restoreProductAction(id: number): Promise<AppActionResult<ProductViewModel>> {
  await requireAdmin();

  if (!isValidId(id)) {
    return {
      success: false,
      message: 'Invalid product ID.',
    };
  }

  try {
    const product = await productService.restore(id);

    return {
      success: true,
      message: 'Product restored successfully.',
      data: mapProduct(product),
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}
