import { TimeFrame } from './timeframe';
import { TimeUnit } from './units-of-time';
import { DateUnitConverter } from './converters/date-unit-converter';
import {
  abbreviatedUnit,
  addUnits,
  between,
  millisecondsPerUnit,
  pluralUnit,
} from './date-unit-calculator';
import { Timespan } from './timespan';
import {
  ALLOWED_WHITESPACE_PATTERN,
  DAYS_PER_WEEK,
  INPUT_REGEX_PATTERN,
  INPUT_REGEX_UNIT_INDEX,
  INPUT_REGEX_VALUE_INDEX,
  MAX_INPUT_STRING_LENGTH,
} from './constants';

/**
 * Convert the timespan to the specified unit of measurement.
 * @param unit - The unit of time
 * @param startDate - The start date.
 * @param endDate - The end date.
 * @returns The duration in the specified time unit.
 */
export function calculateUnitsFromTimespan(
  unit: TimeUnit,
  startDate: Date,
  endDate: Date,
): number {
  return between(unit, startDate, endDate);
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
export function calculateTimespanFromString(
  input: string,
  startDate?: Date,
): Timespan {
  const start = startDate ? startDate : new Date();

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

    const plural = pluralUnit(unit as TimeUnit);
    timeframe[plural] = value;

    // Match the next and run the loop again.
    match = INPUT_REGEX_PATTERN.exec(input);
  }

  // Set the end date to however many milliseconds we have calculated.
  const endDate = new Date(start);

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

  // Return the new timespan to the consumer. Since the timespan does all
  // timeframe and string calculations on initialization, our job here is done.
  return new Timespan(start, endDate);
}

/**
 * Creates a Timespan from the specified number of units.
 * @param amount - The number of the specified units.
 * @param unit - The unit of time.
 * @param startDate - The date to start from.
 * @returns A Timespan object representing the specified number of time units.
 */
export function calculateTimespanFromUnits(
  amount: number,
  unit: TimeUnit,
  startDate?: Date,
): Timespan {
  const start = startDate ? startDate : new Date();
  const end = addUnits(unit, amount, start);
  return new Timespan(start, end);
}

/**
 * Calculates a string representation of a TimeFrame.
 * @param timeFrame - The TimeFrame object to convert.
 * @returns A string representation of the TimeFrame.
 */
export function calculateString(timeFrame: TimeFrame): string {
  const timespanParts: string[] = [];

  // Iterate through the timeFrame and generate the string parts for non-zero values
  for (const unit of Object.keys(timeFrame)) {
    const numericValue = Number(timeFrame[unit]);
    // Check if the value is non-zero and append to the timespanParts
    if (numericValue !== 0) {
      const abbreviation = abbreviatedUnit(unit as TimeUnit);
      timespanParts.push(`${numericValue}${abbreviation}`);
    }
  }
  return timespanParts.join(' ');
}

/**
 * Calculate the TimeFrame representation of the timespan.
 * @param startDate - The start date of the timespan.
 * @param endDate - The end date of the timespan.
 * @returns The TimeFrame object representing the timespan.
 */
export function calculateTimeFrame(startDate: Date, endDate: Date): TimeFrame {
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
  const tempDate = new Date(startDate);

  // Calculating the years and months is... complicated.
  timeFrame.years = between('years', startDate, endDate);

  // We get the total months between the two dates
  const totalMonths = between('months', startDate, endDate);

  // We calculate the months remaining after accounting for the years
  timeFrame.months = Math.floor(
    totalMonths - timeFrame.years * DateUnitConverter.monthsInAYear,
  );

  tempDate.setUTCFullYear(tempDate.getUTCFullYear() + timeFrame.years);
  tempDate.setUTCMonth(tempDate.getUTCMonth() + timeFrame.months);

  const totalTimeDiff = endDate.getTime() - startDate.getTime();

  let remainingTime =
    totalTimeDiff - (tempDate.getTime() - startDate.getTime());

  const millisecondsPerWeek = millisecondsPerUnit('weeks');
  const millisecondsPerDay = millisecondsPerUnit('days');
  const millisecondsPerHour = millisecondsPerUnit('hours');
  const millisecondsPerMinute = millisecondsPerUnit('minutes');
  const millisecondsPerSeconds = millisecondsPerUnit('seconds');

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
