import { DateUnitConverter } from './date-unit-converter';

export type SecondUnit = 'seconds' | 'second' | 'secs' | 'sec' | 's';

/**
 * Represents a converter for the second unit.
 */
export class SecondConverter implements DateUnitConverter {
  /**
   * The default name of the second unit.
   */
  public readonly default: SecondUnit = 'second';

  /**
   * The plural name of the second unit.
   */
  public readonly plural: SecondUnit = 'seconds';

  /**
   * The abbreviated name of the second unit.
   */
  public readonly abbreviation: SecondUnit = 's';

  /**
   * The number of milliseconds per second.
   */
  public readonly millisecondsPerUnit = 1000;

  /**
   * An array of aliases for the second unit.
   */
  public readonly aliases: Array<SecondUnit> = [
    'seconds',
    'second',
    'secs',
    'sec',
    's',
  ];

  /**
   * Calculates the number of seconds between two dates.
   * @param startDate - The start date.
   * @param endDate - The end date.
   * @returns The number of seconds between the two dates.
   * @throws Error if the input dates are invalid or if the start date is greater than the end date.
   */
  public between(startDate: Date, endDate: Date): number {
    if (!(startDate instanceof Date && endDate instanceof Date)) {
      throw new Error('Invalid date inputs.');
    }
    if (startDate.getTime() > endDate.getTime()) {
      throw new Error('Start date cannot be greater than end date.');
    }
    return Math.floor(
      (endDate.getTime() - startDate.getTime()) / this.millisecondsPerUnit,
    );
  }

  /**
   * Adds the specified number of seconds to the given date.
   * @param seconds - The number of seconds to add.
   * @param startDate - The start date.
   * @returns The new date after adding the seconds.
   * @throws Error if the input date is invalid or if the number of seconds is negative.
   */
  public add(seconds: number, startDate: Date): Date {
    if (!(startDate instanceof Date)) {
      throw new Error('Invalid date input.');
    }
    if (seconds < 0) {
      throw new Error('Invalid second input.');
    }
    return new Date(startDate.getTime() + seconds * this.millisecondsPerUnit);
  }
}
