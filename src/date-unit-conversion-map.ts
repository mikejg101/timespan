import { DateUnitConverter } from './converters/date-unit-converter';
import { DayConverter } from './converters/day-converter';
import { HourConverter } from './converters/hour-converter';
import { MillisecondConverter } from './converters/millisecond-convert';
import { MinuteConverter } from './converters/minute-converter';
import { MonthConverter } from './converters/month-converter';
import { SecondConverter } from './converters/second-converter';
import { WeekConverter } from './converters/week-converter';
import { YearConverter } from './converters/year-converter';
import { TimeUnit } from './units-of-time';

/**
 * A table of date unit converters for different time units.
 */
export class DateUnitConversionTable {
  private readonly yearConverter = new YearConverter();
  private readonly monthConverter = new MonthConverter();
  private readonly weekConverter = new WeekConverter();
  private readonly dayConverter = new DayConverter();
  private readonly hourConverter = new HourConverter();
  private readonly minuteConverter = new MinuteConverter();
  private readonly secondConverter = new SecondConverter();
  private readonly millisecondConverter = new MillisecondConverter();

  private readonly conversionTable: {
    [unit in TimeUnit]: DateUnitConverter;
  } = {
    ms: this.millisecondConverter,
    mss: this.millisecondConverter,
    msec: this.millisecondConverter,
    milliseconds: this.millisecondConverter,
    millisecond: this.millisecondConverter,
    s: this.secondConverter,
    sec: this.secondConverter,
    secs: this.secondConverter,
    second: this.secondConverter,
    seconds: this.secondConverter,
    m: this.minuteConverter,
    min: this.minuteConverter,
    mins: this.minuteConverter,
    minute: this.minuteConverter,
    minutes: this.minuteConverter,
    h: this.hourConverter,
    hr: this.hourConverter,
    hrs: this.hourConverter,
    hour: this.hourConverter,
    hours: this.hourConverter,
    d: this.dayConverter,
    dy: this.dayConverter,
    dys: this.dayConverter,
    day: this.dayConverter,
    days: this.dayConverter,
    w: this.weekConverter,
    wk: this.weekConverter,
    wks: this.weekConverter,
    week: this.weekConverter,
    weeks: this.weekConverter,
    M: this.monthConverter,
    mo: this.monthConverter,
    mos: this.monthConverter,
    month: this.monthConverter,
    months: this.monthConverter,
    y: this.yearConverter,
    yr: this.yearConverter,
    yrs: this.yearConverter,
    year: this.yearConverter,
    years: this.yearConverter,
  };

  /**
   * Retrieves the date unit converter for the specified unit.
   * @param unit - The unit to retrieve the converter for.
   * @returns The date unit converter.
   * @throws {Error} If an invalid date unit is specified.
   */
  public get(unit: TimeUnit): DateUnitConverter {
    const converter = this.conversionTable[unit];
    if (!converter) {
      throw new Error(`Invalid date unit: ${unit}`);
    }
    return converter;
  }
}
