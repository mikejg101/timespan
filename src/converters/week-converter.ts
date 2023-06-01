import { DateUnitConverter } from './date-unit-converter';

export type WeekUnit = 'w' | 'wk' | 'wks' | 'week' | 'weeks';

/**
 * Represents a converter for the week unit.
 */
export class WeekConverter implements DateUnitConverter {
  /**
   * The default name of the week unit.
   */
  public readonly default: WeekUnit = 'week';

  /**
   * The plural name of the week unit.
   */
  public readonly plural: WeekUnit = 'weeks';

  /**
   * The abbreviated name of the week unit.
   */
  public readonly abbreviation: WeekUnit = 'w';

  /**
   * The number of milliseconds per week.
   */
  public readonly millisecondsPerUnit = 7 * 24 * 60 * 60 * 1000;

  /**
   * An array of aliases for the week unit.
   */
  public readonly aliases: Array<WeekUnit> = [
    'w',
    'wk',
    'wks',
    'week',
    'weeks',
  ];

  /**
   * Calculates the number of weeks between two dates.
   * @param startDate - The start date.
   * @param endDate - The end date.
   * @returns The number of weeks between the two dates.
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
   * Adds the specified number of weeks to the given date.
   * @param weeks - The number of weeks to add.
   * @param startDate - The start date.
   * @returns The new date after adding the weeks.
   * @throws Error if the input date is invalid or if the number of weeks is negative.
   */
  public add(weeks: number, startDate: Date): Date {
    if (!(startDate instanceof Date)) {
      throw new Error('Invalid date input.');
    }
    if (weeks < 0) {
      throw new Error('Invalid week input.');
    }
    const weeksInMilliseconds = weeks * this.millisecondsPerUnit;
    const addedMilliseconds = startDate.getTime() + weeksInMilliseconds;
    return new Date(addedMilliseconds);
  }
}
