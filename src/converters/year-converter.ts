import { DateUnitConverter } from './date-unit-converter';

export type YearUnit = 'y' | 'yr' | 'yrs' | 'year' | 'years';

/**
 * Represents a converter for the year unit.
 */
export class YearConverter implements DateUnitConverter {
  /**
   * The default name of the year unit.
   */
  public readonly default: YearUnit = 'year';

  /**
   * The plural name of the year unit.
   */
  public readonly plural: YearUnit = 'years';

  /**
   * The abbreviated name of the year unit.
   */
  public readonly abbreviation: YearUnit = 'y';

  /**
   * The number of milliseconds per year.
   */
  public readonly millisecondsPerUnit = 1000 * 60 * 60 * 24 * 365;

  /**
   * An array of aliases for the year unit.
   */
  public readonly aliases: Array<YearUnit> = ['yrs', 'yr', 'y'];

  /**
   * Calculates the number of years between two dates.
   * @param startDate - The start date.
   * @param endDate - The end date.
   * @returns The number of years between the two dates.
   * @throws Error if the input dates are invalid or if the start date is greater than the end date.
   */
  public between(startDate: Date, endDate: Date): number {
    if (
      !(startDate instanceof Date) ||
      !(endDate instanceof Date) ||
      isNaN(startDate.getTime()) ||
      isNaN(endDate.getTime())
    ) {
      throw new Error('Invalid date inputs.');
    }
    if (startDate.getTime() > endDate.getTime()) {
      throw new Error('Start date cannot be greater than end date.');
    }
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    return endYear - startYear;
  }

  /**
   * Adds the specified number of years to the given date.
   * @param years - The number of years to add.
   * @param startDate - The start date.
   * @returns The new date after adding the years.
   * @throws Error if the input date is invalid or if the number of years is negative.
   */
  public add(years: number, startDate: Date): Date {
    if (!(startDate instanceof Date)) {
      throw new Error('Invalid date input.');
    }
    if (years < 0) {
      throw new Error('Invalid year input.');
    }
    const startYear = startDate.getFullYear();
    const targetYear = startYear + years;

    // Check if the starting date is on February 29th
    const isStartDateOnLeapYearDay =
      startDate.getMonth() === 1 && startDate.getDate() === 29;

    const dateWithYearsAdded = new Date(startDate.getTime());
    dateWithYearsAdded.setFullYear(targetYear);

    // If the starting date is on February 29th and the target year is not a leap year,
    // set the date to February 28th
    if (isStartDateOnLeapYearDay && !this.isLeapYear(targetYear)) {
      dateWithYearsAdded.setMonth(1);
      dateWithYearsAdded.setDate(28);
    }

    return dateWithYearsAdded;
  }

  /**
   * Checks if a given year is a leap year.
   * @param year - The year to check.
   * @returns True if the year is a leap year, false otherwise.
   */
  private isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }
}
