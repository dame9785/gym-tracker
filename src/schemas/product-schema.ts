import { z } from 'zod';

// --------------------------------------------------
// Shared schemas
// --------------------------------------------------

const productNameSchema = z.string().trim().min(2, 'Product name must be at least 2 characters long.').max(191, 'Product name can be maximum 191 characters long.');

const optionalTextSchema = (maxLength: number, message: string) => z.string().trim().max(maxLength, message).optional().or(z.literal(''));

const nutritionSchema = {
  calories: z.number().min(0).max(10000),
  protein: z.number().min(0).max(1000),
  carbs: z.number().min(0).max(1000),
  fat: z.number().min(0).max(1000),
};

const productDataQualitySchema = z.enum(['VERIFIED', 'STANDARD', 'UNVERIFIED']);

// --------------------------------------------------
// Create product
// --------------------------------------------------

export const createProductSchema = z.object({
  name: productNameSchema,
  brand: optionalTextSchema(100, 'Brand can be maximum 100 characters long.'),
  barcode: optionalTextSchema(50, 'Barcode can be maximum 50 characters long.'),
  category: optionalTextSchema(100, 'Category can be maximum 100 characters long.'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  ...nutritionSchema,
  dataQuality: productDataQualitySchema.default('UNVERIFIED'),
  nutritionSource: optionalTextSchema(255, 'Nutrition source can be maximum 255 characters long.'),
});

// --------------------------------------------------
// Update product
// --------------------------------------------------

export const updateProductSchema = createProductSchema.partial();

// --------------------------------------------------
// DTO types
// --------------------------------------------------

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
