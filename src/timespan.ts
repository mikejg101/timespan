import { AbbreviatedTimeUnit } from './abbreviated-time-unit';
import { conversionTable } from './time-conversion';
import { TimeUnit } from './time-unit';
import { TimeFrame } from './timeframe';

export class Timespan {
  private readonly startDate: Date;
  private readonly endDate: Date;
  private readonly timeDiff: number;
  private readonly stringValue: string;
  private readonly timeFrame: TimeFrame;
  private static readonly inputStringPattern = /(\d+)\s*([a-zA-Z]+)/g;

  /**
   * Create a Timespan instance from a string input.
   * @param input - The input string representing the timespan.
   * @returns A Timespan instance representing the parsed timespan.
   * @throws Error if the input is invalid or contains an invalid unit.
   */
  public static fromString(input: string): Timespan {
    let totalMilliseconds = 0;

    let match = Timespan.inputStringPattern.exec(input);
    if (!match) {
      throw new Error(`Invalid unit`);
    }
    while (match) {
      const value = Number(match[1]);
      const unit: string = match[2];

      if (this.isKeyOf(unit, TimeUnit)) {
        const keyUnit = unit as keyof typeof TimeUnit;
        const numericValue = Number(value);

        // Retrieve the conversion factor from the conversion table
        const conversionFactor = conversionTable.get(
          TimeUnit[keyUnit]
        ) as number;

        // Calculate the total milliseconds based on the value and conversion factor
        totalMilliseconds += numericValue * conversionFactor;
      } else {
        throw new Error(`Invalid unit: ${value}${unit}`);
      }

      match = this.inputStringPattern.exec(input);
    }

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - totalMilliseconds);
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
    return this.toMilliseconds() / 1000;
  }

  /**
   * Convert the timespan to the total duration in minutes.
   * @returns The duration in minutes.
   */
  public toMinutes(): number {
    return this.toSeconds() / 60;
  }

  /**
   * Convert the timespan to the total duration in hours.
   * @returns The duration in hours.
   */
  public toHours(): number {
    return this.toMinutes() / 60;
  }

  /**
   * Convert the timespan to the total duration in days.
   * @returns The duration in days.
   */
  public toDays(): number {
    return this.toHours() / 24;
  }

  /**
   * Convert the timespan to the total duration in weeks.
   * @returns The duration in weeks.
   */
  public toWeeks(): number {
    return this.toDays() / 7;
  }

  /**
   * Convert the timespan to the total duration in months.
   * @returns The duration in months.
   */
  public toMonths(): number {
    return this.toDays() / 30.4167;
  }

  /**
   * Convert the timespan to the total duration in years.
   * @returns The duration in years.
   */
  public toYears(): number {
    return this.toDays() / 365;
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

    // Iterate through the conversionTable and calculate the value for each unit
    for (const [unit, conversionFactor] of conversionTable.entries()) {
      const value = Math.floor(remainingTime / conversionFactor);
      timeFrame[unit] = value;
      remainingTime -= value * conversionFactor;

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
    for (const [unit, value] of Object.entries(timeFrame)) {
      if (Timespan.isKeyOf(unit, TimeUnit)) {
        const keyUnit = unit as keyof typeof TimeUnit;
        const numericValue = Number(value);

        // Check if the value is non-zero and append to the timespanParts
        if (numericValue !== 0 && TimeUnit[keyUnit]) {
          timespanParts.push(`${numericValue}${AbbreviatedTimeUnit[keyUnit]}`);
        }
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
    obj: Record<T, unknown>
  ): unit is T {
    return Object.prototype.hasOwnProperty.call(obj, unit);
  }
}
