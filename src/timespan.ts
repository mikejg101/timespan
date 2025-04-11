import { TimeFrame } from './timeframe';
import { TimeUnit } from './units-of-time';
import {
  calculateString,
  calculateTimeFrame,
  calculateTimespanFromString,
  calculateTimespanFromUnits,
  calculateUnitsFromTimespan,
} from './timespan-utils';

/**
 * Represents a time span between two dates.
 */
export class Timespan {
  /**
   * The start of the time span.
   */
  private readonly startDate: Date;

  /**
   * The end of the time span.
   */
  private readonly endDate: Date;

  /**
   * We precalculate the string value when the Timespan
   * is created so you don't incur as much memory cost generating
   * it when you want to use it.
   */
  private readonly stringValue: string;

  /**
   * We go ahead and generate the TimeFrame when the Timespan
   * is created. This way you can go ahead and get the timeframe
   * at only point without incurring any extra memory cost.
   */
  private readonly timeFrame: TimeFrame;

  /**
   * Create a new Timespan instance.
   * @param start - The start date of the timespan.
   * @param end - The end date of the timespan.
   */
  constructor(start: Date, end: Date) {
    this.startDate = start;
    this.endDate = end;
    this.timeFrame = calculateTimeFrame(start, end);
    this.stringValue = calculateString(this.timeFrame);
  }

  /**
   * Get the start date of the timespan.
   * @returns The start date.
   */
  public get start(): Date {
    return this.startDate;
  }

  /**
   * Get the end date of the timespan.
   * @returns The end date.
   */
  public get end(): Date {
    return this.endDate;
  }

  /**
   * Create a Timespan instance from a string input.
   * @example - "1y 2M 3w 4d 5h 6m 7s 8ms"
   * @example - "1yr 2mos 3wks 4dys 5hrs 6mins 7secs 8mss"
   * @example - "2years 1month 3weeks 4days"
   * @param input - The input string representing the timespan.
   * @param startDate - Optional start date for the timespan. If not provided, the current date is used.
   * @returns A Timespan instance representing the parsed timespan.
   * @throws Error if the input is invalid or contains an invalid unit.
   */
  public static fromString = (input: string, startDate?: Date): Timespan =>
    calculateTimespanFromString(input, startDate);

  /**
   * Creates a Timespan from the specified number of units.
   * @param amount - The number of the specified units.
   * @param unit - The unit of time.
   * @param startDate - The date to start from.
   * @returns A Timespan object representing the specified number of time units.
   */
  public static fromUnits = (
    amount: number,
    unit: TimeUnit,
    startDate?: Date,
  ): Timespan => calculateTimespanFromUnits(amount, unit, startDate);

  /**
   * Creates a Timespan object from a specified number of milliseconds.
   * @param millis - The number of milliseconds for the timespan.
   * @param startDate - Optional start date for the timespan. If not provided, the current date is used.
   * @returns A Timespan object representing the specified number of milliseconds.
   */
  public static fromMilliseconds = (
    millis: number,
    startDate?: Date,
  ): Timespan => calculateTimespanFromUnits(millis, 'milliseconds', startDate);

  /**
   * Creates a Timespan object from a specified number of seconds.
   * @param seconds - The number of seconds for the timespan.
   * @param startDate - Optional start date for the timespan. If not provided, the current date is used.
   * @returns A Timespan object representing the specified number of seconds.
   */
  public static fromSeconds = (seconds: number, startDate?: Date): Timespan =>
    calculateTimespanFromUnits(seconds, 'seconds', startDate);

  /**
   * Creates a Timespan object from a specified number of minutes.
   * @param minutes - The number of minutes for the timespan.
   * @param startDate - Optional start date for the timespan. If not provided, the current date is used.
   * @returns A Timespan object representing the specified number of minutes.
   */
  public static fromMinutes = (minutes: number, startDate?: Date): Timespan =>
    calculateTimespanFromUnits(minutes, 'minutes', startDate);

  /**
   * Creates a Timespan object from a specified number of hours.
   * @param hours - The number of hours for the timespan.
   * @param startDate - Optional start date for the timespan. If not provided, the current date is used.
   * @returns A Timespan object representing the specified number of hours.
   */
  public static fromHours = (hours: number, startDate?: Date): Timespan =>
    calculateTimespanFromUnits(hours, 'hours', startDate);

  /**
   * Creates a Timespan object from a specified number of days.
   * @param days - The number of days for the timespan.
   * @param startDate - Optional start date for the timespan. If not provided, the current date is used.
   * @returns A Timespan object representing the specified number of days.
   */
  public static fromDays = (days: number, startDate?: Date): Timespan =>
    calculateTimespanFromUnits(days, 'days', startDate);

  /**
   * Creates a Timespan object from a specified number of weeks.
   * @param weeks - The number of weeks for the timespan.
   * @param startDate - Optional start date for the timespan. If not provided, the current date is used.
   * @returns A Timespan object representing the specified number of weeks.
   */
  public static fromWeeks = (weeks: number, startDate?: Date): Timespan =>
    calculateTimespanFromUnits(weeks, 'weeks', startDate);

  /**
   * Creates a Timespan object from a specified number of months.
   * @param months - The number of months for the timespan.
   * @param startDate - Optional start date for the timespan. If not provided, the current date is used.
   * @returns A Timespan object representing the specified number of months.
   */
  public static fromMonths = (months: number, startDate?: Date): Timespan =>
    calculateTimespanFromUnits(months, 'months', startDate);

  /**
   * Creates a Timespan object from a specified number of years.
   * @param years - The number of years for the timespan.
   * @param startDate - Optional start date for the timespan. If not provided, the current date is used.
   * @returns A Timespan object representing the specified number of years.
   */
  public static fromYears = (years: number, startDate?: Date): Timespan =>
    calculateTimespanFromUnits(years, 'years', startDate);

  /**
   * Convert the timespan to a TimeFrame object.
   * @returns The TimeFrame object representing the timespan.
   */
  public toTimeframe = (): TimeFrame => this.timeFrame;

  /**
   * Convert the timespan to a string representation.
   * @returns The string representation of the timespan.
   */
  public toString = (): string => this.stringValue;

  /**
   * Convert the timespan to the specified unit of measurement.
   * @param unit - The unit of time
   * @returns The duration in the specified time unit.
   */
  public toUnit = (unit: TimeUnit): number =>
    calculateUnitsFromTimespan(unit, this.startDate, this.endDate);

  /**
   * Convert the timespan to the total duration in milliseconds.
   * @returns The duration in milliseconds.
   */
  public toMilliseconds = (): number => this.toUnit('milliseconds');

  /**
   * Convert the timespan to the total duration in seconds.
   * @returns The duration in seconds.
   */
  public toSeconds = (): number => this.toUnit('seconds');

  /**
   * Convert the timespan to the total duration in minutes.
   * @returns The duration in minutes.
   */
  public toMinutes = (): number => this.toUnit('minutes');

  /**
   * Convert the timespan to the total duration in hours.
   * @returns The duration in hours.
   */
  public toHours = (): number => this.toUnit('hours');

  /**
   * Convert the timespan to the total duration in days.
   * @returns The duration in days.
   */
  public toDays = (): number => this.toUnit('days');

  /**
   * Convert the timespan to the total duration in weeks.
   * @returns The duration in weeks.
   */
  public toWeeks = (): number => this.toUnit('weeks');

  /**
   * Convert the timespan to the total duration in months.
   * @returns The duration in months.
   */
  public toMonths = (): number => this.toUnit('months');

  /**
   * Convert the timespan to the total duration in years.
   * @returns The duration in years.
   */
  public toYears = (): number => this.toUnit('years');
}
