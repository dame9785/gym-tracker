import { z } from 'zod';

// Birth Date Schema
const birthDateSchema = z.iso.date('Invalid birth date.').refine((date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(date) <= today;
}, 'Birth date cannot be in the future.');

// Goal Date Schema
const goalDateSchema = z.iso.date('Invalid date.').refine((date) => {
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return new Date(date) >= tomorrow;
}, 'Goal date must be in the future.');

// Register User Schema
export const registerUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters long.')
    .max(20, 'Username cannot exceed 20 characters.')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores.'),

  password: z
    .string()
    .min(2, 'Password must be at least 2 characters long.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character.'),

  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required.')
    .regex(/^[\p{L}\s-]+$/u, 'First name can only contain letters.'),

  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required.')
    .regex(/^[\p{L}\s-]+$/u, 'Last name can only contain letters.'),

  phoneNumber: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s()-]/g, ''))
    .refine((value) => /^(?:\+46|0)7\d{8}$/.test(value), 'Please enter a valid Swedish mobile phone number.')
    .transform((value) => (value.startsWith('0') ? `+46${value.slice(1)}` : value)),

  email: z.string().trim().email('Please enter a valid email address.').toLowerCase(),

  bodyWeight: z.number().min(20, 'Body weight must be at least 20 kg.').max(400, 'Body weight cannot exceed 400 kg.'),

  height: z.number().min(20, 'Height must be at least 20 cm.').max(400, 'Height cannot exceed 400 cm.'),

  goalWeight: z.number().min(20, 'Goal weight must be at least 20 kg.').max(400, 'Goal weight cannot exceed 400 kg.'),

  birthDate: birthDateSchema,
  goalDate: goalDateSchema,

  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  goalType: z.enum(['MUSCLE_GAIN', 'WEIGHT_LOSS', 'MAINTENANCE']),
});

// Update User Schema
export const updateUserSchema = registerUserSchema.omit({
  password: true,
});

// Login Schema
export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),

  password: z.string().min(1, 'Password is required.'),
});

/* User DTOs */
export type RegisterUserDto = z.infer<typeof registerUserSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
