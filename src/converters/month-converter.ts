import { DateUnitConverter } from './date-unit-converter';

export type MonthUnit = 'M' | 'mo' | 'mos' | 'month' | 'months';

/**
 * Represents a converter for the month unit.
 */
export class MonthConverter implements DateUnitConverter {
  /**
   * The default name of the month unit.
   */
  public readonly default: MonthUnit = 'month';

  /**
   * The plural name of the month unit.
   */
  public readonly plural: MonthUnit = 'months';

  /**
   * The abbreviated name of the month unit.
   */
  public readonly abbreviation: MonthUnit = 'M';

  /**
   * The number of milliseconds per month (-1).
   */
  public readonly millisecondsPerUnit = -1;

  /**
   * An array of aliases for the month unit.
   */
  public readonly aliases: Array<MonthUnit> = [
    'months',
    'month',
    'mos',
    'mo',
    'M',
  ];

  /**
   * Calculates the number of months between two dates.
   * @param startDate - The start date.
   * @param endDate - The end date.
   * @returns The number of months between the two dates.
   * @throws Error if the input dates are invalid or if the start date is greater than the end date.
   */
  public between(startDate: Date, endDate: Date): number {
    if (!(startDate instanceof Date && endDate instanceof Date)) {
      throw new Error('Invalid date inputs.');
    }

    if (startDate.getTime() > endDate.getTime()) {
      throw new Error('Start date cannot be greater than end date.');
    }

    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const startDay = startDate.getDate();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
    const endDay = endDate.getDate();

    let months = (endYear - startYear) * 12 + (endMonth - startMonth);
    if (endDay < startDay) {
      months--;
    }
    return Math.floor(months);
  }

  /**
   * Adds the specified number of months to the given date.
   * @param months - The number of months to add.
   * @param startDate - The start date.
   * @returns The new date after adding the months.
   * @throws Error if the input date is invalid or if the number of months is negative.
   */
  public add(months: number, startDate: Date): Date {
    if (!(startDate instanceof Date)) {
      throw new Error('Invalid date input.');
    }
    if (months < 0) {
      throw new Error('Invalid month input.');
    }
    const newDate = new Date(startDate);
    const originalHours = newDate.getUTCHours();
    const originalMinutes = newDate.getUTCMinutes();
    const originalSeconds = newDate.getUTCSeconds();
    const originalMilliseconds = newDate.getUTCMilliseconds();
    newDate.setUTCHours(0, 0, 0, 0); // Set UTC time components to zero
    newDate.setUTCMonth(newDate.getUTCMonth() + months);
    newDate.setUTCHours(
      originalHours,
      originalMinutes,
      originalSeconds,
      originalMilliseconds,
    ); // Restore original UTC time components
    return newDate;
  }
}
