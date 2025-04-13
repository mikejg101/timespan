import Constants from '../constants';

/**
 * Asserts that the input string contains only allowed characters.
 * @param value - The input string to check.
 */
export function assertAllowedCharacters(
  value: unknown,
): asserts value is string {
  if (
    value === null ||
    typeof value !== 'string' ||
    !Constants.AllowedCharactersRegexPattern.test(value)
  ) {
    throw new Error('Invalid input string');
  }
}
