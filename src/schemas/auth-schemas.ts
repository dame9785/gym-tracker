import { z } from 'zod';

//Register User Validation
export const registerSchema = z.object({
  //Check if is valid email adress
  email: z.email('Ogiltig e-postadress.').trim().toLowerCase(),

  //check if user-name has at least 3 characters and max 20 characters and only has characters not numbers
  username: z
    .string()
    .min(3, 'Användarnamnet måste vara minst 3 tecken.')
    .max(20, 'Användarnamnet får vara högst 20 tecken.')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Användarnamnet får endast innehålla bokstäver, siffror, - och _.'),

  //Check if password has at least 8 characters &at least one big letter &&  at least & one small letter && at least 1 number && special characters
  password: z
    .string()
    .trim()
    .min(8, 'Lösenordet måste vara minst 8 tecken.')
    .regex(/[A-Z]/, 'Minst en stor bokstav krävs.')
    .regex(/[a-z]/, 'Minst en liten bokstav krävs.')
    .regex(/[0-9]/, 'Minst en siffra krävs.')
    .regex(/[^A-Za-z0-9]/, 'Minst ett specialtecken krävs.'),

  //Check if first name has at least minimum 1 characters && and only contains characters and not numbers.
  firstName: z
    .string()
    .trim()
    .min(1, 'Förnamn måste anges.')
    .regex(/^[A-Za-zÅÄÖåäö\s-]+$/, 'Förnamnet får endast innehålla bokstäver.'),

  //Check if lastName has only contains letters && at least 1 character
  lastName: z
    .string()
    .trim()
    .min(1, 'Efternamnet måste innehålla minst 1 bokstav')
    .regex(/^[A-Za-zÅÄÖåäö\s-]+$/, 'Efternamnet får endast innehålla bokstäver.'),

  //Check if user name is swedish phonenumber.
  phoneNumber: z
    .string()
    .trim()
    .regex(/^(?:\+46|0)7\d{8}$/, 'Ogiltigt svenskt telefonnummer.'),

  //Check if body-weigth max is 400 and min 20kg
  bodyWeight: z.number().min(20, 'Ogiltig kroppsvikt.').max(400, 'Ogiltig kroppsvikt.'),

  //Check if body-length is max 300 and min 50
  bodyLenght: z.number().min(30, 'Ogiltig längd.').max(300, 'Ogiltig längd.'),

  //Check if goal-weight is max 300 and min
  goalWeight: z.number().min(20, 'Ogiltig målvikt.').max(400, 'Ogiltig målvikt.'),

  //Check if user has at least 1 minimum goal selected.
  goalTypeId: z.number().min(1, 'Du måste välja ett mål.'),

  //Check Birth-Date is valid ISO-date
  birthDate: z.iso.date('Ogiltigt födelsedatum.').refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return new Date(date) <= today;
  }, 'Födelsedatum kan inte ligga i framtiden.'),

  //Check Goal-Date is valid ISO-date
  goalDate: z.iso.date('Ogiltigt datum').refine((date) => {
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return new Date(date) >= tomorrow;
  }, 'Måldatum måste ligga i framtiden.'),

  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
});

//Update User Validation
export const updateSchema = registerSchema.omit({
  password: true,
});

//Login validation
export const loginSchema = z.object({
  email: z.email('Ogiltig e-postadress'),
  password: z.string().min(8, 'Lösenordet måste vara minst 8 tecken.'),
});

export type RegisterUserDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type UpdateUserDto = z.infer<typeof updateSchema>;
