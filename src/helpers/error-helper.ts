import type { ZodIssue } from 'zod';
import { Prisma } from '@prisma/client';

import type { RegisterUserDto, UpdateUserDto } from '@/schemas/auth-schemas';

export class ErrorsHelper {
  // Zod errors -> Form errors
  static getFormErrors<T>(issues: ZodIssue[]): Partial<Record<keyof T, string>> {
    return Object.fromEntries(issues.map((issue) => [String(issue.path[0]), issue.message])) as Partial<
      Record<keyof T, string>
    >;
  }

  // API errors -> Form errors
  static getFormErrorsFromApi<T>(errors: Record<string, string[]>): Partial<Record<keyof T, string>> {
    return Object.fromEntries(Object.entries(errors).map(([field, messages]) => [field, messages[0]])) as Partial<
      Record<keyof T, string>
    >;
  }

  // Form errors -> API errors
  static toApiFieldErrors<T>(fieldErrors: Partial<Record<keyof T, string>>): Record<string, string[]> {
    return Object.fromEntries(Object.entries(fieldErrors).map(([field, message]) => [field, [message as string]]));
  }

  /**
   * Maps Prisma unique constraint violations
   * to field-specific validation errors.
   */
  static getUniqueConstraintFieldErrors<T extends RegisterUserDto | UpdateUserDto>(
    error: Prisma.PrismaClientKnownRequestError,
  ): Partial<Record<keyof T, string>> {
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
