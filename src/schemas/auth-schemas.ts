import { z } from 'zod';

// --------------------------------------------------
// Date helpers
// --------------------------------------------------

const toLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// --------------------------------------------------
// Shared schemas
// --------------------------------------------------

const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters long.')
  .max(128, 'Password cannot exceed 128 characters.')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .regex(/[0-9]/, 'Password must contain at least one number.')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character.');

const emailSchema = z.string().trim().email('Please enter a valid email address.').toLowerCase();

// --------------------------------------------------
// Birth date schema
// --------------------------------------------------

const birthDateSchema = z.iso
  .date('Invalid birth date.')
  .refine((date) => {
    const today = toLocalDateString(new Date());

    return date <= today;
  }, 'Birth date cannot be in the future.')
  .refine((date) => {
    const minimumDate = new Date();

    minimumDate.setFullYear(minimumDate.getFullYear() - 16);

    return date <= toLocalDateString(minimumDate);
  }, 'You must be at least 16 years old.');

// --------------------------------------------------
// Goal date schema
// --------------------------------------------------

const goalDateSchema = z.iso.date('Invalid date.').refine((date) => {
  const tomorrow = new Date();

  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return date >= toLocalDateString(tomorrow);
}, 'Goal date must be in the future.');

// --------------------------------------------------
// User object schema
// --------------------------------------------------

const registerUserObjectSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Username must be at least 3 characters long.')
    .max(20, 'Username cannot exceed 20 characters.')
    .regex(/^[a-z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores.'),

  password: passwordSchema,

  confirmPassword: z.string().min(1, 'Please confirm your password.'),

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

  email: emailSchema,

  bodyWeight: z.number().min(20, 'Body weight must be at least 20 kg.').max(400, 'Body weight cannot exceed 400 kg.'),

  goalWeight: z.number().min(20, 'Goal weight must be at least 20 kg.').max(400, 'Goal weight cannot exceed 400 kg.'),

  height: z.number().min(100, 'Height must be at least 100 cm.').max(250, 'Height cannot exceed 250 cm.'),

  birthDate: birthDateSchema,
  goalDate: goalDateSchema,

  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),

  goalType: z.enum(['MUSCLE_GAIN', 'WEIGHT_LOSS', 'MAINTENANCE']),
});

// --------------------------------------------------
// Register user schema
// --------------------------------------------------

export const registerUserSchema = registerUserObjectSchema.refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

// --------------------------------------------------
// Update user schema
// --------------------------------------------------

export const updateUserSchema = registerUserObjectSchema.omit({
  password: true,
  confirmPassword: true,
});

// --------------------------------------------------
// Login schema
// --------------------------------------------------

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.'),
});

// --------------------------------------------------
// Change password schema
// --------------------------------------------------

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),

    newPassword: passwordSchema,

    confirmNewPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match.',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from your current password.',
    path: ['newPassword'],
  });

// --------------------------------------------------
// Forgot password schema
// --------------------------------------------------

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// --------------------------------------------------
// Reset password schema
// --------------------------------------------------

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Invalid or missing reset token.'),

    newPassword: passwordSchema,

    confirmNewPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match.',
    path: ['confirmNewPassword'],
  });

// --------------------------------------------------
// User DTOs
// --------------------------------------------------

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
