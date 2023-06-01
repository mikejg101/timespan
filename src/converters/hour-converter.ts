import { DateUnitConverter } from './date-unit-converter';

export type HourUnit = 'h' | 'hr' | 'hrs' | 'hour' | 'hours';

/**
 * Represents a converter for the hour unit.
 */
export class HourConverter implements DateUnitConverter {
  /**
   * The default name of the hour unit.
   */
  public readonly default: HourUnit = 'hour';

  /**
   * The plural name of the hour unit.
   */
  public readonly plural: HourUnit = 'hours';

  /**
   * The abbreviated name of the hour unit.
   */
  public readonly abbreviation: HourUnit = 'h';

  /**
   * The number of milliseconds per hour.
   */
  public readonly millisecondsPerUnit = 60 * 60 * 1000;

  /**
   * An array of aliases for the hour unit.
   */
  public readonly aliases: Array<HourUnit> = ['hrs', 'hr', 'h'];
  /**
   * Calculates the number of hours between two dates.
   * @param startDate - The start date.
   * @param endDate - The end date.
   * @returns The number of hours between the two dates.
   * @throws Error if the input dates are invalid or if the start date is greater than the end date.
   */
  public between(startDate: Date, endDate: Date): number {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      throw new Error('Invalid date input.');
    }
    if (startDate.getTime() > endDate.getTime()) {
      throw new Error('Start date cannot be greater than end date.');
    }
    return Math.floor(
      (endDate.getTime() - startDate.getTime()) / this.millisecondsPerUnit,
    );
  }

  /**
   * Adds the specified number of hours to the given date.
   * @param hours - The number of hours to add.
   * @param startDate - The start date.
   * @returns The new date after adding the hours.
   * @throws Error if the input date is invalid or if the number of hours is negative.
   */
  public add(hours: number, startDate: Date): Date {
    if (!(startDate instanceof Date)) {
      throw new Error('Invalid date input.');
    }
    if (hours < 0) {
      throw new Error('Invalid hour input.');
    }
    return new Date(startDate.getTime() + hours * this.millisecondsPerUnit);
  }
}
