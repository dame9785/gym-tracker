import { z } from 'zod';

const nameSchema = z
  .string()
  .trim()
  .min(1, 'Namnet måste anges.')
  .regex(/^[\p{L}\s-]+$/u, 'Namnet får endast innehålla bokstäver.');

const passwordSchema = z
  .string()
  .min(8, 'Lösenordet måste vara minst 8 tecken.')
  .regex(/[A-Z]/, 'Minst en stor bokstav krävs.')
  .regex(/[a-z]/, 'Minst en liten bokstav krävs.')
  .regex(/[0-9]/, 'Minst en siffra krävs.')
  .regex(/[^A-Za-z0-9]/, 'Minst ett specialtecken krävs.');

const phoneNumberSchema = z
  .string()
  .trim()
  .regex(
    /^(?:\+46|0)7\d{8}$/,
    'Ogiltigt svenskt telefonnummer.'
  );

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Ogiltig e-postadress.')
    .toLowerCase(),

  username: z
    .string()
    .trim()
    .min(3, 'Användarnamnet måste vara minst 3 tecken.')
    .max(20, 'Användarnamnet får vara högst 20 tecken.')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Användarnamnet får endast innehålla bokstäver, siffror, - och _.'
    ),

  password: passwordSchema,

  firstName: nameSchema,

  lastName: nameSchema,

  phoneNumber: phoneNumberSchema,

  bodyWeight: z
    .number()
    .min(20, 'Ogiltig kroppsvikt.')
    .max(400, 'Ogiltig kroppsvikt.'),

  height: z
    .number()
    .min(50, 'Ogiltig längd.')
    .max(300, 'Ogiltig längd.'),

  goalWeight: z
    .number()
    .min(20, 'Ogiltig målvikt.')
    .max(400, 'Ogiltig målvikt.'),

  goalTypeId: z
    .number()
    .min(1, 'Du måste välja ett mål.'),

  birthDate: z
    .iso.date('Ogiltigt födelsedatum.')
    .refine((date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return new Date(date) <= today;
    }, 'Födelsedatum kan inte ligga i framtiden.'),

  goalDate: z
    .iso.date('Ogiltigt datum.')
    .refine((date) => {
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);

      return new Date(date) >= tomorrow;
    }, 'Måldatum måste ligga i framtiden.'),

  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
});

export const updateSchema = registerSchema
  .omit({
    password: true,
  });
  

export const loginSchema = registerSchema.pick({
  email: true,
  password: true,
});

export type RegisterUserDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type UpdateUserDto = z.infer<typeof updateSchema>;