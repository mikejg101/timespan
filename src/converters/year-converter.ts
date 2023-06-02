import { YearUnit } from '../units-of-time';
import { DateUnitConverter } from './date-unit-converter';

/**
 * Represents a converter for the year unit.
 */
export class YearConverter extends DateUnitConverter {
  private static readonly february28 = 28;
  private static readonly february29 = 29;
  private static readonly february = 1;
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
  public readonly millisecondsPerUnit =
    DateUnitConverter.millsecondsInASecond *
    DateUnitConverter.secondsInAMinute *
    DateUnitConverter.minutesInAnHour *
    DateUnitConverter.hoursInADay *
    DateUnitConverter.daysInAYear;

  /**
   * An array of aliases for the year unit.
   */
  public readonly aliases: Array<YearUnit> = [
    'years',
    'year',
    'yrs',
    'yr',
    'y',
  ];

  /**
   * Calculates the number of years between two dates.
   * @param startDate - The start date.
   * @param endDate - The end date.
   * @returns The number of years between the two dates.
   * @throws Error if the input dates are invalid or if the start date is greater than the end date.
   */
  public between(startDate: Date, endDate: Date): number {
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
    const startYear = startDate.getFullYear();
    const targetYear = startYear + years;

    // Check if the starting date is on February 29th
    const isStartDateOnLeapYearDay =
      startDate.getMonth() === YearConverter.february &&
      startDate.getDate() === YearConverter.february29;

    const dateWithYearsAdded = new Date(startDate.getTime());
    dateWithYearsAdded.setFullYear(targetYear);

    // If the starting date is on February 29th and the target year is not a leap year,
    // set the date to February 28th
    if (isStartDateOnLeapYearDay && !this.isLeapYear(targetYear)) {
      dateWithYearsAdded.setMonth(YearConverter.february);
      dateWithYearsAdded.setDate(YearConverter.february28);
    }

    return dateWithYearsAdded;
  }
}
