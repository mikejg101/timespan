export type MillisecondUnit =
  | 'milliseconds'
  | 'millisecond'
  | 'msec'
  | 'mss'
  | 'ms';
export type SecondUnit = 'seconds' | 'second' | 'secs' | 'sec' | 's';
export type MinuteUnit = 'm' | 'min' | 'mins' | 'minute' | 'minutes';
export type HourUnit = 'h' | 'hr' | 'hrs' | 'hour' | 'hours';
export type DayUnit = 'd' | 'dys' | 'dy' | 'day' | 'days';
export type WeekUnit = 'w' | 'wk' | 'wks' | 'week' | 'weeks';
export type MonthUnit = 'M' | 'mo' | 'mos' | 'month' | 'months';
export type YearUnit = 'y' | 'yr' | 'yrs' | 'year' | 'years';

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
