import Constants from '../constants';

/**
 * Asserts that the input string does not exceed the maximum allowed length.
 * @param value - The input string to check.
 */
export function assertMaxInputLength(value: unknown): asserts value is string {
  if (
    value === null ||
    typeof value !== 'string' ||
    value.length > Constants.MaxInputStringLength
  ) {
    throw new Error(`Invalid input string`);
  }
}
