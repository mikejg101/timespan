import { DateUnitConverter } from './date-unit-converter';

export type DayUnit = 'd' | 'dys' | 'dy' | 'day' | 'days';

/**
 * Represents a converter for the day unit.
 */
export class DayConverter implements DateUnitConverter {
  /**
   * The default name of the day unit.
   */
  public readonly default: DayUnit = 'day';

  /**
   * The plural name of the day unit.
   */
  public readonly plural: DayUnit = 'days';

  /**
   * The abbreviated name of the day unit.
   */
  public readonly abbreviation: DayUnit = 'd';

  /**
   * The number of milliseconds per day.
   */
  public readonly millisecondsPerUnit = 24 * 60 * 60 * 1000;

  /**
   * An array of aliases for the day unit.
   */
  public readonly aliases: Array<DayUnit> = ['day', 'days', 'dys', 'dy', 'd'];

  /**
   * Calculates the number of days between two dates.
   * @param startDate - The start date.
   * @param endDate - The end date.
   * @returns The number of days between the two dates.
   * @throws Error if the input dates are invalid or if the start date is greater than the end date.
   */
  public between(startDate: Date, endDate: Date): number {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      throw new Error('Invalid date input.');
    }
    if (startDate.getTime() > endDate.getTime()) {
      throw new Error('Start date cannot be greater than end date.');
    }

    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const startDayOfYear = this.getDayOfYear(startDate);
    const endDayOfYear = this.getDayOfYear(endDate);

    let dayCount = (endYear - startYear) * 365; // Calculate full years

    // Add one extra day for each leap year between start and end (excluding end year)
    for (let year = startYear; year < endYear; year++) {
      if (this.isLeapYear(year)) {
        dayCount++;
      }
    }

    // Add remaining days within the start and end years
    dayCount += endDayOfYear - startDayOfYear;

    return Math.floor(dayCount);
  }

  /**
   * Adds the specified number of days to the given date.
   * @param days - The number of days to add.
   * @param startDate - The start date.
   * @returns The new date after adding the days.
   * @throws Error if the input date is invalid or if the number of days is negative.
   */
  public add(days: number, startDate: Date): Date {
    if (!(startDate instanceof Date)) {
      throw new Error('Invalid date input.');
    }
    if (days < 0) {
      throw new Error('Invalid day input.');
    }
    return new Date(startDate.getTime() + days * this.millisecondsPerUnit);
  }

  /**
   * Gets the day of the year for the given date.
   * @param date - The date.
   * @returns The day of the year (1-based index).
   */
  private getDayOfYear = (date: Date): number => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - startOfYear.getTime();
    return Math.floor(diff / (24 * 60 * 60 * 1000)) + 1;
  };

  /**
   * Checks if the given year is a leap year.
   * @param year - The year.
   * @returns True if the year is a leap year, false otherwise.
   */
  private isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };
}
