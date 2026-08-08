//Types
import type { RegisterUserDto, UpdateUserDto } from '@/schemas/auth-schemas';
import { Prisma } from '@prisma/client';

export default class FieldErrorsMessagesHelper {
  /**
   * Maps Prisma unique constraint violations to field-specific validation errors.
   *
   * Used to provide user-friendly error messages when a unique field,
   * such as email or username, is already registered in the database.
   */
  static getUniqueConstraintFieldErrors<T extends RegisterUserDto | UpdateUserDto>(error: Prisma.PrismaClientKnownRequestError): Partial<Record<keyof T, string>> {
    const fieldErrors: Partial<Record<keyof T, string>> = {};
    const target = error.meta?.target;

    if (Array.isArray(target) && target.includes('email')) {
      fieldErrors.email = 'E-postadressen används redan.';
    }

    if (Array.isArray(target) && target.includes('username')) {
      fieldErrors.username = 'Användarnamnet används redan.';
    }

    return fieldErrors;
  }
}
