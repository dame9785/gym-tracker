const VALIDATION_ERROR_PREFIXES = ['Validation failed: ', 'Registration failed: ', 'User update failed: ', 'User already exists: '];

export function getActionErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Something went wrong.';
  }

  if (VALIDATION_ERROR_PREFIXES.some((prefix) => error.message.startsWith(prefix))) {
    return 'Please correct the highlighted fields.';
  }

  if (error.message === 'Invalid email or password.' || error.message === 'User not found.') {
    return error.message;
  }

  console.error('[ActionError] Unexpected error:', error);

  return 'Something went wrong.';
}

export function getActionValidationErrors(error: unknown): Record<string, string[]> | undefined {
  if (!(error instanceof Error)) {
    return undefined;
  }

  const prefix = VALIDATION_ERROR_PREFIXES.find((item) => error.message.startsWith(item));

  if (!prefix) {
    return undefined;
  }

  try {
    const parsed: unknown = JSON.parse(error.message.slice(prefix.length));

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return undefined;
    }

    const errors: Record<string, string[]> = {};

    for (const [field, value] of Object.entries(parsed)) {
      if (typeof value === 'string') {
        errors[field] = [value];
      } else if (Array.isArray(value)) {
        const messages = value.filter((item): item is string => typeof item === 'string');

        if (messages.length > 0) {
          errors[field] = messages;
        }
      }
    }

    return Object.keys(errors).length > 0 ? errors : undefined;
  } catch {
    return undefined;
  }
}
