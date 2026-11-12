export function isValidId(id: number): boolean {
  return Number.isSafeInteger(id) && id > 0;
}
