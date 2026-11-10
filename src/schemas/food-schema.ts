import { z } from 'zod';

export const searchFoodSchema = z.object({
  query: z.string().trim().min(2, 'Sökningen måste innehålla minst 2 tecken.').max(100, 'Sökningen får innehålla högst 100 tecken.'),
});

export const foodBarcodeSchema = z.object({
  barcode: z
    .string()
    .trim()
    .regex(/^\d{8,14}$/, 'Streckkoden måste innehålla 8–14 siffror.'),
});

export const importExternalFoodSchema = z.object({
  barcode: z
    .string()
    .trim()
    .regex(/^\d{8,14}$/, 'Ogiltig streckkod.'),
});

export type SearchFoodDto = z.infer<typeof searchFoodSchema>;
export type FoodBarcodeDto = z.infer<typeof foodBarcodeSchema>;
export type ImportExternalFoodDto = z.infer<typeof importExternalFoodSchema>;
