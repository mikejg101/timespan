import { TimeFrame } from './timeframe';
import { TimeUnit } from './units-of-time';
import { DateUnitCalculator } from './date-unit-calculator';
import { DateUnitConverter } from './converters/date-unit-converter';
import {
  ALLOWED_WHITESPACE_PATTERN,
  DAYS_PER_WEEK,
  INPUT_REGEX_PATTERN,
  INPUT_REGEX_UNIT_INDEX,
  INPUT_REGEX_VALUE_INDEX,
  MAX_INPUT_STRING_LENGTH,
} from './internal/constants';

/**
 * Represents a time span between two dates.
 */
export class Timespan {
  private static readonly dateUnitCalculator = new DateUnitCalculator();
  /**
   * The start of the time span.
   */
  private readonly startDate: Date;

  /**
   * The end of the time span.
   */
  private readonly endDate: Date;

  /**
   * The number of milliseconds between the two dates.
   */
  private readonly timeDiff: number;

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
   * Create a Timespan instance from a string input.
   * @example - "1y 2M 3w 4d 5h 6m 7s 8ms"
   * @example - "1yr 2mos 3wks 4dys 5hrs 6mins 7secs 8mss"
   * @example - "2years 1month 3weeks 4days"
   * @param input - The input string representing the timespan.
   * @param startDate - Optional start date for the timespan. If not provided, the current date is used.
   * @returns A Timespan instance representing the parsed timespan.
   * @throws Error if the input is invalid or contains an invalid unit.
   */
  public static fromString(
    input: string,
    startDate: Date = new Date(),
  ): Timespan {
    // Limit the possible input string to prevent abuse.
    if (input.length > MAX_INPUT_STRING_LENGTH) {
      throw new Error(`Invalid input string`);
    }

    // Whitelist specific characters.
    if (!ALLOWED_WHITESPACE_PATTERN.test(input)) {
      throw new Error(`Invalid input string`);
    }

    const timeframe: TimeFrame = {
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    };

    // Start matching the regex.
    let match = INPUT_REGEX_PATTERN.exec(input);

    // Check to see if we don't have a match.
    if (!match) {
      throw new Error(`Invalid unit`);
    }

    // Loop over the matches as we make more matches.
    while (match) {
      const value = Number(match[INPUT_REGEX_VALUE_INDEX]);
      const unit: string = match[INPUT_REGEX_UNIT_INDEX];

      const plural = this.dateUnitCalculator.pluralUnit(unit as TimeUnit);
      timeframe[plural] = value;

      // Match the next and run the loop again.
      match = INPUT_REGEX_PATTERN.exec(input);
    }

    // Set the end date to however many milliseconds we have calculated.
    const endDate = new Date(startDate);

    endDate.setUTCFullYear(endDate.getUTCFullYear() + timeframe.years);
    endDate.setUTCMonth(endDate.getUTCMonth() + timeframe.months);
    endDate.setUTCDate(endDate.getUTCDate() + timeframe.weeks * DAYS_PER_WEEK);
    endDate.setUTCDate(endDate.getUTCDate() + timeframe.days);
    endDate.setUTCHours(endDate.getUTCHours() + timeframe.hours);
    endDate.setUTCMinutes(endDate.getUTCMinutes() + timeframe.minutes);
    endDate.setUTCSeconds(endDate.getUTCSeconds() + timeframe.seconds);
    endDate.setUTCMilliseconds(
      endDate.getUTCMilliseconds() + timeframe.milliseconds,
    );

    // Return the new timespan to the consumer. Since the timespan does all of
    // timeframe and string calculations on initialization, our job here is done.
    return new Timespan(startDate, endDate);
  }

  /**
   * Creates a Timespan object from a specified number of milliseconds.
   * @param milliseconds - The number of milliseconds for the timespan.
   * @param startDate - Optional start date for the timespan. If not provided, the current date is used.
   * @returns A Timespan object representing the specified number of milliseconds.
   */
  public static fromMilliseconds(
    milliseconds: number,
    startDate?: Date,
  ): Timespan {
    const start = startDate ? startDate : new Date();
    const end = Timespan.dateUnitCalculator.addUnits(
      'milliseconds',
      milliseconds,
      startDate ? startDate : new Date(),
    );
    return new Timespan(start, end);
  }

  /**
   * Creates a Timespan object from a specified number of seconds.
   * @param seconds - The number of seconds for the timespan.
   * @param startDate - Optional start date for the timespan. If not provided, the current date is used.
   * @returns A Timespan object representing the specified number of seconds.
   */
  public static fromSeconds(seconds: number, startDate?: Date): Timespan {
    const start = startDate ? startDate : new Date();
    const end = Timespan.dateUnitCalculator.addUnits('seconds', seconds, start);
    return new Timespan(start, end);
  }

  /**
   * Creates a Timespan object from a specified number of minutes.
   * @param minutes - The number of minutes for the timespan.
   * @param startDate - Optional start date for the timespan. If not provided, the current date is used.
   * @returns A Timespan object representing the specified number of minutes.
   */
  public static fromMinutes(minutes: number, startDate?: Date): Timespan {
    const start = startDate ? startDate : new Date();
    const end = Timespan.dateUnitCalculator.addUnits('minutes', minutes, start);
    return new Timespan(start, end);
  }

  /**
   * Creates a Timespan object from a specified number of hours.
   * @param hours - The number of hours for the timespan.
   * @param startDate - Optional start date for the timespan. If not provided, the current date is used.
   * @returns A Timespan object representing the specified number of hours.
   */
  public static fromHours(hours: number, startDate?: Date): Timespan {
    const start = startDate ? startDate : new Date();
    const end = Timespan.dateUnitCalculator.addUnits('hours', hours, start);
    return new Timespan(start, end);
  }

  /**
   * Creates a Timespan object from a specified number of days.
   * @param days - The number of days for the timespan.
   * @param startDate - Optional start date for the timespan. If not provided, the current date is used.
   * @returns A Timespan object representing the specified number of days.
   */
  public static fromDays(days: number, startDate?: Date): Timespan {
    const start = startDate ? startDate : new Date();
    const end = Timespan.dateUnitCalculator.addUnits('days', days, start);
    return new Timespan(start, end);
  }

  /**
   * Creates a Timespan object from a specified number of weeks.
   * @param weeks - The number of weeks for the timespan.
   * @param startDate - Optional start date for the timespan. If not provided, the current date is used.
   * @returns A Timespan object representing the specified number of weeks.
   */
  public static fromWeeks(weeks: number, startDate?: Date): Timespan {
    const start = startDate ? startDate : new Date();
    const end = Timespan.dateUnitCalculator.addUnits('weeks', weeks, start);
    return new Timespan(start, end);
  }

  /**
   * Creates a Timespan object from a specified number of months.
   * @param months - The number of months for the timespan.
   * @param startDate - Optional start date for the timespan. If not provided, the current date is used.
   * @returns A Timespan object representing the specified number of months.
   */
  public static fromMonths(months: number, startDate?: Date): Timespan {
    const start = startDate ? startDate : new Date();
    const end = Timespan.dateUnitCalculator.addUnits('months', months, start);
    return new Timespan(start, end);
  }

  /**
   * Creates a Timespan object from a specified number of years.
   * @param years - The number of years for the timespan.
   * @param startDate - Optional start date for the timespan. If not provided, the current date is used.
   * @returns A Timespan object representing the specified number of years.
   */
  public static fromYears(years: number, startDate?: Date): Timespan {
    const start = startDate ? startDate : new Date();
    const end = Timespan.dateUnitCalculator.addUnits('years', years, start);
    return new Timespan(start, end);
  }

  /**
   * Create a new Timespan instance.
   * @param start - The start date of the timespan.
   * @param end - The end date of the timespan.
   */
  constructor(start: Date, end: Date) {
    this.startDate = start;
    this.endDate = end;
    this.timeDiff = end.getTime() - start.getTime();
    this.timeFrame = this.calculateTimeFrame();
    this.stringValue = this.calculateString();
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
   * Convert the timespan to a TimeFrame object.
   * @returns The TimeFrame object representing the timespan.
   */
  public toTimeframe(): TimeFrame {
    return this.timeFrame;
  }

  /**
   * Convert the timespan to a string representation.
   * @returns The string representation of the timespan.
   */
  public toString(): string {
    return this.stringValue;
  }

  /**
   * Convert the timespan to the total duration in milliseconds.
   * @returns The duration in milliseconds.
   */
  public toMilliseconds(): number {
    return this.timeDiff;
  }

  /**
   * Convert the timespan to the total duration in seconds.
   * @returns The duration in seconds.
   */
  public toSeconds(): number {
    return Timespan.dateUnitCalculator.between(
      'seconds',
      this.startDate,
      this.endDate,
    );
  }

  /**
   * Convert the timespan to the total duration in minutes.
   * @returns The duration in minutes.
   */
  public toMinutes(): number {
    return Timespan.dateUnitCalculator.between(
      'minutes',
      this.startDate,
      this.endDate,
    );
  }

  /**
   * Convert the timespan to the total duration in hours.
   * @returns The duration in hours.
   */
  public toHours(): number {
    return Timespan.dateUnitCalculator.between(
      'hours',
      this.startDate,
      this.endDate,
    );
  }

  /**
   * Convert the timespan to the total duration in days.
   * @returns The duration in days.
   */
  public toDays(): number {
    return Timespan.dateUnitCalculator.between(
      'days',
      this.startDate,
      this.endDate,
    );
  }

  /**
   * Convert the timespan to the total duration in weeks.
   * @returns The duration in weeks.
   */
  public toWeeks(): number {
    return Timespan.dateUnitCalculator.between(
      'weeks',
      this.startDate,
      this.endDate,
    );
  }

  /**
   * Convert the timespan to the total duration in months.
   * @returns The duration in months.
   */
  public toMonths(): number {
    return Timespan.dateUnitCalculator.between(
      'months',
      this.startDate,
      this.endDate,
    );
  }

  /**
   * Convert the timespan to the total duration in years.
   * @returns The duration in years.
   */
  public toYears(): number {
    return Timespan.dateUnitCalculator.between(
      'years',
      this.startDate,
      this.endDate,
    );
  }

  /**
   * Calculate the TimeFrame representation of the timespan.
   * @returns The TimeFrame object representing the timespan.
   */
  private calculateTimeFrame(): TimeFrame {
    const timeFrame: TimeFrame = {
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    };
    const tempDate = new Date(this.startDate);

    // Calculating the years and months is... complicated.
    timeFrame.years = Timespan.dateUnitCalculator.between(
      'years',
      this.startDate,
      this.endDate,
    );

    const totalMonths = Timespan.dateUnitCalculator.between(
      'months',
      this.startDate,
      this.endDate,
    );

    timeFrame.months = Math.floor(
      totalMonths - timeFrame.years * DateUnitConverter.monthsInAYear,
    );
    tempDate.setUTCFullYear(tempDate.getUTCFullYear() + timeFrame.years);
    tempDate.setUTCMonth(tempDate.getUTCMonth() + timeFrame.months);

    let remainingTime =
      this.timeDiff - (tempDate.getTime() - this.startDate.getTime());

    const millisecondsPerWeek =
      Timespan.dateUnitCalculator.millisecondsPerUnit('weeks');
    const millisecondsPerDay =
      Timespan.dateUnitCalculator.millisecondsPerUnit('days');
    const millisecondsPerHour =
      Timespan.dateUnitCalculator.millisecondsPerUnit('hours');
    const millisecondsPerMinute =
      Timespan.dateUnitCalculator.millisecondsPerUnit('minutes');
    const millisecondsPerSeconds =
      Timespan.dateUnitCalculator.millisecondsPerUnit('seconds');

    timeFrame.weeks = Math.floor(remainingTime / millisecondsPerWeek);
    remainingTime %= millisecondsPerWeek;
    timeFrame.days = Math.floor(remainingTime / millisecondsPerDay);
    remainingTime %= millisecondsPerDay;
    timeFrame.hours = Math.floor(remainingTime / millisecondsPerHour);
    remainingTime %= millisecondsPerHour;
    timeFrame.minutes = Math.floor(remainingTime / millisecondsPerMinute);
    remainingTime %= millisecondsPerMinute;
    timeFrame.seconds = Math.floor(remainingTime / millisecondsPerSeconds);
    remainingTime %= millisecondsPerSeconds;
    timeFrame.milliseconds = remainingTime;

    return timeFrame;
  }

  /**
   * Calculate the string representation of the timespan.
   * @returns The string representation of the timespan.
   */
  private calculateString(): string {
    const timeFrame = this.toTimeframe();
    const timespanParts: string[] = [];

    // Iterate through the timeFrame and generate the string parts for non-zero values
    for (const unit of Object.keys(timeFrame)) {
      const numericValue = Number(timeFrame[unit]);
      // Check if the value is non-zero and append to the timespanParts
      if (numericValue !== 0) {
        const abbreviation = Timespan.dateUnitCalculator.abbreviatedUnit(
          unit as TimeUnit,
        );
        timespanParts.push(`${numericValue}${abbreviation}`);
      }
    }
    return timespanParts.join(' ');
  }
}
