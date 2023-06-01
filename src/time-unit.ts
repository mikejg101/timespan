import { DayUnit } from './converters/day-converter';
import { HourUnit } from './converters/hour-converter';
import { MillisecondUnit } from './converters/millisecond-convert';
import { MinuteUnit } from './converters/minute-converter';
import { MonthUnit } from './converters/month-converter';
import { SecondUnit } from './converters/second-converter';
import { WeekUnit } from './converters/week-converter';
import { YearUnit } from './converters/year-converter';

/**
 * Enumeration of time units.
 */
export type TimeUnit =
  | MillisecondUnit
  | SecondUnit
  | MinuteUnit
  | HourUnit
  | DayUnit
  | WeekUnit
  | MonthUnit
  | YearUnit;
