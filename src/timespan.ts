import { TimeFrame } from './timeframe';
import { TimeUnit } from './units-of-time';
import { DateUnitCalculator } from './date-unit-calculator';
import { DateUnitConverter } from './converters/date-unit-converter';

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
   * This is the index of the value in the inputString
   * regex match.
   */
  private static readonly inputRegexValueIndex = 1;

  /**
   * This is the index of the unit in the inputString
   * regex match.
   */
  private static readonly inputRegexUnitIndex = 2;

  /**
   * The number of days in a week.
   * @returns 7
   */
  private static readonly daysPerWeek = 7;

  /**
   * This sets the max allowable input string length to help reduce Regex
   * Denial of Service attacks. This combined with some other strategies should
   * help reduce the vulnerability. It is still recommended to clean any input
   * you are using, especially if it originates from an uncontrolled source
   * such as a user typing input into an input field on the internet.
   */
  private static readonly maxInputStringLength = 75;

  /**
   * /(\d{0,10})([^\s\d]+)/g
   *
   * This regex pattern /(\d{0,10})([^\s\d]+)/g aims to match and
   * a sequence of digits (0-9) of up to 10 characters, captured in the first group.
   * A series of one or more non-whitespace, non-digit characters, captured in
   * the second group.
   *
   * No regex is perfect. It is recommended that you clean any input
   * you are using, especially if it originates from an uncontrolled source
   * such as a user typing input into an input field on the internet.
   *
   * - (\d{0,10}):
   * This part captures a sequence of digits (0-9) that can occur between
   * 0 and 10 times. The parentheses ( ) indicate a capturing group, which
   * means the matched digits will be stored and accessible separately.
   *
   * - ([^\s\d]+): This part captures one or more characters that are not
   * whitespace and not digits. The square brackets [ ] define a character
   * class, and the ^ at the beginning of the class negates it. So [^\s\d]
   * matches any character that is not a whitespace character or a digit.
   * The + quantifier specifies that one or more characters should be matched.
   *
   * - g:
   * The g flag stands for "global" and indicates that the regex should
   * search for all matches in the input string, rather than stopping after
   * the first match.
   *
   * A few examples of acceptable inputs are:
   *
   * 1y 2M 3w 4d 5h 6m 7s 8ms
   *
   * 1yr 2mos 3wks 4dys 5hrs 6mins 7secs 8mss
   *
   * 2years 1month 3weeks 4days
   */
  private static readonly inputStringPattern = /(\d{0,10})([^\s\d]+)/g;

  /**
   * /^[a-zA-Z0-9\s]+$/
   *
   * This regex pattern ensures that the entire input string consists of
   * one or more uppercase or lowercase letters, digits, or whitespace
   * characters. It does not allow any other characters in the string.
   *
   * This Regex, combined with some other strategies should
   * help reduce the vulnerability. It is still recommended to clean any input
   * you are using, especially if it originates from an uncontrolled source
   * such as a user typing input into an input field on the internet.
   *
   * - ^:
   * This anchor asserts the start of the string. It specifies that the
   * matching pattern should start at the beginning of the string.
   *
   * - [a-zA-Z0-9\s]+: This character set specifies the allowed characters
   * in the string. It matches one or more occurrences (+) of any uppercase
   * or lowercase letter ([a-zA-Z]), digit (0-9), or whitespace character (\s).
   *
   * - $: This anchor asserts the end of the string. It specifies that the
   * matching pattern should end at the end of the string.
   *
   * "Hello123": This input matches the pattern because it consists of
   * only letters and digits.
   *
   * "Test String": This input matches the pattern because it consists of
   * only letters and whitespace characters.
   *
   * "123-456": This input does not match the pattern because it contains
   * a hyphen character, which is not allowed.
   *
   * "@#$": This input does not match the pattern because it contains special
   * characters that are not part of the allowed character set.
   */
  private static readonly allowedWhitespacePattern = /^[a-zA-Z0-9\s]+$/;

  /**
   * Create a Timespan instance from a string input.
   * @example - "1y 2M 3w 4d 5h 6m 7s 8ms"
   * @example - "1yr 2mos 3wks 4dys 5hrs 6mins 7secs 8mss"
   * @example - "2years 1month 3weeks 4days"
   * @param input - The input string representing the timespan.
   * @returns A Timespan instance representing the parsed timespan.
   * @throws Error if the input is invalid or contains an invalid unit.
   */
  public static fromString(input: string): Timespan {
    // Limit the possible input string to prevent abuse.
    if (input.length > Timespan.maxInputStringLength) {
      throw new Error(`Invalid input string`);
    }

    // Whitelist specific characters.
    if (!Timespan.allowedWhitespacePattern.test(input)) {
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
    let match = Timespan.inputStringPattern.exec(input);

    // Check to see if we don't have a match.
    if (!match) {
      throw new Error(`Invalid unit`);
    }

    // Loop over the matches as we make more matches.
    while (match) {
      const value = Number(match[Timespan.inputRegexValueIndex]);
      const unit: string = match[Timespan.inputRegexUnitIndex];

      const plural = this.dateUnitCalculator.pluralUnit(unit as TimeUnit);
      timeframe[plural] = value;

      // Match the next and run the loop again.
      match = this.inputStringPattern.exec(input);
    }

    // Set the start date as the date we want to count from.
    const startDate = new Date();

    // Set the end date to however many milliseconds we have calculated.
    const endDate = new Date(startDate);

    endDate.setUTCFullYear(endDate.getUTCFullYear() + timeframe.years);
    endDate.setUTCMonth(endDate.getUTCMonth() + timeframe.months);
    endDate.setUTCDate(
      endDate.getUTCDate() + timeframe.weeks * Timespan.daysPerWeek,
    );
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
