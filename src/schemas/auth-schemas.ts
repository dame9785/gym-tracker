import { z } from 'zod';

//Goal Birth Date Schema
const birtDateSchema = z.iso.date('Ogiltigt födelsedatum.').refine((date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(date) <= today;
}, 'Födelsedatum kan inte ligga i framtiden.');

//Goal Date Schema
const goalDateSchema = z.iso.date('Ogiltigt datum.').refine((date) => {
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return new Date(date) >= tomorrow;
}, 'Måldatum måste ligga i framtiden.');

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Användarnamnet måste vara minst 3 tecken.')
    .max(20, 'Användarnamnet får vara högst 20 tecken.')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Användarnamnet får endast innehålla bokstäver, siffror, - och _.'),

  password: z
    .string()
    .min(2, 'Lösenordet måste vara minst 2 tecken.')
    .regex(/[A-Z]/, 'Minst en stor bokstav krävs.')
    .regex(/[a-z]/, 'Minst en liten bokstav krävs.')
    .regex(/[0-9]/, 'Minst en siffra krävs.')
    .regex(/[^A-Za-z0-9]/, 'Minst ett specialtecken krävs.'),

  firstName: z
    .string()
    .trim()
    .min(1, 'Namnet måste anges.')
    .regex(/^[\p{L}\s-]+$/u, 'Namnet får endast innehålla bokstäver.'),

  lastName: z
    .string()
    .trim()
    .min(1, 'Efternamnet måste anges.')
    .regex(/^[\p{L}\s-]+$/u, 'Efternamnet får endast innehålla bokstäver.'),

  phoneNumber: z
    .string()
    .trim()
    .regex(/^(?:\+46|0)7\d{8}$/, 'Ogiltigt svenskt telefonnummer.'),

  email: z.string().trim().email('Ogiltig e-postadress.').toLowerCase(),
  bodyWeight: z.number().min(20, 'Ogiltig kroppsvikt.').max(400, 'Ogiltig kroppsvikt.'),
  height: z.number().min(20, 'Otilåten längd minsta längd 1.20cm').max(400, 'Otilåten längd'),
  goalWeight: z.number().min(20, 'Ogiltig målvikt.').max(400, 'Ogiltig målvikt.'),
  goalTypeId: z.number().min(1, 'Du måste välja ett mål.'),
  birthDate: birtDateSchema,
  goalDate: goalDateSchema,
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
});

export const updateSchema = registerSchema.omit({
  password: true,
});

export const loginSchema = z.object({
  email: z.string().trim().email('Ogiltig e-postadress.'),
  password: z.string().min(1, 'Lösenord krävs.'),
});

export const addWeightSchema = z.object({
  weight: z.number('Vikt får enbart ha siffor').min(20, 'Ogiltig vikt').max(400, 'Ogiltig vikt'),
  note: z.string().trim().min(1, 'Du måste fylla i anteckning'),
});

/*User Dtos*/
export type RegisterUserDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type UpdateUserDto = z.infer<typeof updateSchema>;

/*Weight Dtos*/
export type AddWeightDto = z.infer<typeof addWeightSchema>;
