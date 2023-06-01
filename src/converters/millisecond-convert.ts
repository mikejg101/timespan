import { DateUnitConverter } from './date-unit-converter';

export type MillisecondUnit =
  | 'milliseconds'
  | 'millisecond'
  | 'msec'
  | 'mss'
  | 'ms';

/**
 * Represents a converter for the millisecond unit.
 */
export class MillisecondConverter implements DateUnitConverter {
  /**
   * The default name of the millisecond unit.
   */
  public readonly default: MillisecondUnit = 'millisecond';

  /**
   * The plural name of the millisecond unit.
   */
  public readonly plural: MillisecondUnit = 'milliseconds';

  /**
   * The abbreviated name of the millisecond unit.
   */
  public readonly abbreviation: MillisecondUnit = 'ms';

  /**
   * The number of milliseconds per millisecond (1).
   */
  public readonly millisecondsPerUnit = 1;

  /**
   * An array of aliases for the millisecond unit.
   */
  public readonly aliases: Array<MillisecondUnit> = [
    'milliseconds',
    'millisecond',
    'msec',
    'mss',
    'ms',
  ];

  /**
   * Calculates the number of milliseconds between two dates.
   * @param startDate - The start date.
   * @param endDate - The end date.
   * @returns The number of milliseconds between the two dates.
   * @throws Error if the input dates are invalid or if the start date is greater than the end date.
   */
  public between(startDate: Date, endDate: Date): number {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      throw new Error('Invalid date input.');
    }
    if (startDate.getTime() > endDate.getTime()) {
      throw new Error('Start date cannot be greater than end date.');
    }
    return endDate.getTime() - startDate.getTime();
  }

  /**
   * Adds the specified number of milliseconds to the given date.
   * @param milliseconds - The number of milliseconds to add.
   * @param startDate - The start date.
   * @returns The new date after adding the milliseconds.
   * @throws Error if the input date is invalid or if the number of milliseconds is negative.
   */
  public add(milliseconds: number, startDate: Date): Date {
    if (!(startDate instanceof Date)) {
      throw new Error('Invalid date input.');
    }
    if (milliseconds < 0) {
      throw new Error('Invalid millisecond input.');
    }
    return new Date(startDate.getTime() + milliseconds);
  }
}
