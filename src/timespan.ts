import { conversionTable } from './time-conversion';
import { TimeFrame } from './timeframe';

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
   * The number of milliseconds between the two dates.
   */
  private readonly timeDiff: number;

  /**
   * We precalculate the string value when the Timespan
   * is created so you don't incure as much memory cost generating
   * it when you want to use it.
   */
  private readonly stringValue: string;

  /**
   * We go ahead and generate the TimeFrame when the Timespan
   * is created. This way you can go ahead and get the timeframe
   * at only point without incuring any extra memory cost.
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
   * The number of milliseconds in a second.
   * @returns 1000
   */
  private static readonly millisecondsPerSecond = 1000;

  /**
   * The number of seconds in a minute.
   * @returns 60
   */
  private static readonly secondsPerMinute = 60;

  /**
   * The number of minutes in an hour.
   * @returns 60
   */
  private static readonly minutesPerHour = 60;

  /**
   * The number of hours in a day.
   * @returns 24
   */
  private static readonly hoursPerDay = 24;

  /**
   * The number of days in a week.
   * @returns 7
   */
  private static readonly daysPerWeek = 7;

  /**
   * Admittedly, this one could be improved. This is a guess
   * based on 365 and ignores leap years. It might be a better
   * idea to calculate the actual days between the two dates
   * rather then using this.
   * @returns 365
   */
  private static readonly daysPerYear = 365;

  /**
   * Admittedly, this one could be improved. This is a guess
   * based on the average number of days. It might be a better
   * idea to calculate the actual months between the two dates
   * rather then using this.
   * @returns 30.437
   */
  private static readonly averageDaysPerMonth = 30.437;

  /**
   * This sets the max allowable input string length to help reduce Regex
   * Denial of Service attacks. This combined with some other strategies should
   * help reduce the vulnerability. It is still recommended to clean any input
   * you are using, especially if it originates from an uncontrolled source
   * such as a user typing input into an input field on the internet.
   */
  private static readonly maxInputStringLength = 75;

  /**
   * /(\d+)\s*([^\s\d]+)/g
   *
   * This regex pattern /(\d+)\s*([^\s\d]+)/g aims to match and
   * capture sequences in the input string where one or more digits are
   * followed by optional whitespace characters (\d+\s*) followed by one
   * or more characters that are not whitespace or digits ([^\s\d]+).
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
  private static readonly allowedWhitspacePattern = /^[a-zA-Z0-9\s]+$/;

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
    if (!Timespan.allowedWhitspacePattern.test(input)) {
      throw new Error(`Invalid input string`);
    }

    // Get a running tally of the total milliseconds represented
    // by the string input.
    let totalMilliseconds = 0;

    // Start matching the regex.
    let match = Timespan.inputStringPattern.exec(input);

    // Check to see if we don't have a match.
    if (!match) {
      throw new Error(`Invalid unit`);
    }

    // Loop over the matches as we make more matches.
    while (match) {
      // Get the value from the value index in the current match.
      const value = Number(match[Timespan.inputRegexValueIndex]);
      // Get the unit from the unit index in the current match.
      const unit: string = match[Timespan.inputRegexUnitIndex];

      // Make sure that the unit is actually an acceptable unit.
      if (Timespan.isKeyOf(unit, conversionTable)) {
        // Retrieve the conversion factor from the conversion table
        const conversionFactor = conversionTable[unit].conversionFactor;

        // Calculate the total milliseconds based on the value and conversion factor
        totalMilliseconds += value * conversionFactor;
      } else {
        // If we don't find the unit, throw an error that let's the consumer
        // know what the problematic unit was.
        throw new Error(`Invalid unit: ${value}${unit}`);
      }

      // Match the next and run the loop again.
      match = this.inputStringPattern.exec(input);
    }

    // Set the start date as the date we want to count from.
    const startDate = new Date();

    // Set the end date to however many milliseconds we have calculated.
    const endDate = new Date(startDate.getTime() + totalMilliseconds);

    // Return the new timespan to the consumer. Since the timespan does all of
    // timeframe and string calculations on initialization, our job here is done.
    return new Timespan(startDate, endDate);
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
    return this.toMilliseconds() / Timespan.millisecondsPerSecond;
  }

  /**
   * Convert the timespan to the total duration in minutes.
   * @returns The duration in minutes.
   */
  public toMinutes(): number {
    return this.toSeconds() / Timespan.secondsPerMinute;
  }

  /**
   * Convert the timespan to the total duration in hours.
   * @returns The duration in hours.
   */
  public toHours(): number {
    return this.toMinutes() / Timespan.minutesPerHour;
  }

  /**
   * Convert the timespan to the total duration in days.
   * @returns The duration in days.
   */
  public toDays(): number {
    return this.toHours() / Timespan.hoursPerDay;
  }

  /**
   * Convert the timespan to the total duration in weeks.
   * @returns The duration in weeks.
   */
  public toWeeks(): number {
    return this.toDays() / Timespan.daysPerWeek;
  }

  /**
   * Convert the timespan to the total duration in months.
   * @returns The duration in months.
   */
  public toMonths(): number {
    return this.toDays() / Timespan.averageDaysPerMonth;
  }

  /**
   * Convert the timespan to the total duration in years.
   * @returns The duration in years.
   */
  public toYears(): number {
    return this.toDays() / Timespan.daysPerYear;
  }

  /**
   * Calculate the TimeFrame representation of the timespan.
   * @returns The TimeFrame object representing the timespan.
   */
  private calculateTimeFrame(): TimeFrame {
    const milliseconds = Number(this.timeDiff);
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

    let remainingTime = milliseconds;

    for (const unit of Object.keys(timeFrame)) {
      if (Timespan.isKeyOf(unit, conversionTable)) {
        // Retrieve the conversion factor from the conversion table
        const conversionFactor = conversionTable[unit].conversionFactor;
        // calculate the number of units with this conversion factor.
        const value = Math.floor(remainingTime / conversionFactor);
        // Set the value in the timeframe.
        timeFrame[unit] = value;
        // Calculate the total remainingTime based on the value and conversion factor
        remainingTime -= value * conversionFactor;
      }
      if (remainingTime === 0) {
        break;
      }
    }
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
      if (numericValue !== 0 && Timespan.isKeyOf(unit, conversionTable)) {
        const abbreviation = conversionTable[unit].abbreviation;
        timespanParts.push(`${numericValue}${abbreviation}`);
      }
    }
    return timespanParts.join(' ');
  }

  /**
   * Check if a unit is a key of a given object.
   * @param unit - The unit to check.
   * @param obj - The object to check against.
   * @returns True if the unit is a key of the object, false otherwise.
   */
  private static isKeyOf<T extends string>(
    unit: string,
    obj: Record<T, unknown>,
  ): unit is T {
    return Object.prototype.hasOwnProperty.call(obj, unit);
  }
}
