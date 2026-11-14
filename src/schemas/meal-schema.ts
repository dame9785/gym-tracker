import { MealType } from '@prisma/client';
import { z } from 'zod';

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format.')
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);

    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, 'Invalid date.');

export const mealTypeSchema = z.nativeEnum(MealType);

export const quantitySchema = z.number().finite().positive('Quantity must be greater than zero.').max(10000, 'Quantity is too large.');

export const addProductSchema = z.object({
  productId: z.number().int().positive(),
  date: dateSchema,
  type: mealTypeSchema,
  quantity: quantitySchema,
});

export const addCustomFoodSchema = z.object({
  customFoodId: z.number().int().positive(),
  date: dateSchema,
  type: mealTypeSchema,
  quantity: quantitySchema,
});

export const updateQuantitySchema = z.object({
  mealItemId: z.number().int().positive(),
  quantity: quantitySchema,
});
