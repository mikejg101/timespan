import { DayUnit } from '../units-of-time';
import { DateUnitConverter } from './date-unit-converter';

/**
 * Represents a converter for the day unit.
 */
export class DayConverter extends DateUnitConverter {
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
  public readonly millisecondsPerUnit =
    DateUnitConverter.hoursInADay *
    DateUnitConverter.minutesInAnHour *
    DateUnitConverter.secondsInAMinute *
    DateUnitConverter.millsecondsInASecond;

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
    const startYear = startDate.getUTCFullYear();
    const endYear = endDate.getUTCFullYear();
    const startDayOfYear = this.getDayOfYear(startDate);
    const endDayOfYear = this.getDayOfYear(endDate);

    // Calculate full years
    let dayCount = (endYear - startYear) * DateUnitConverter.daysInAYear;

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
    return new Date(startDate.getTime() + days * this.millisecondsPerUnit);
  }

  /**
   * Gets the day of the year for the given date.
   * @param date - The date.
   * @returns The day of the year (1-based index).
   */
  private getDayOfYear(date: Date): number {
    const startOfYear = new Date(date.getUTCFullYear(), 0, 1);
    const diff = date.getTime() - startOfYear.getTime();
    return Math.floor(diff / this.millisecondsPerUnit) + 1;
  }
}
