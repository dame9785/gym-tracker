import { z } from 'zod';

export class ErrorsHelper {
  static getFormErrors<T extends object>(issues: z.ZodIssue[]): Partial<Record<keyof T, string>> {
    const errors: Partial<Record<keyof T, string>> = {};

    for (const issue of issues) {
      const field = issue.path[0] as keyof T;

      if (field !== undefined && errors[field] === undefined) {
        errors[field] = issue.message;
      }
    }

    return errors;
  }
}
