import { TimeUnit } from './time-unit';

export const conversionTable: Map<TimeUnit, number> = new Map([
  // Years
  [TimeUnit.years, 31536000000],
  [TimeUnit.year, 31536000000],
  [TimeUnit.yrs, 31536000000],
  [TimeUnit.y, 31536000000],

  // Months
  [TimeUnit.months, 2592000000],
  [TimeUnit.month, 2592000000],
  [TimeUnit.mos, 2592000000],
  [TimeUnit.mo, 2592000000],
  [TimeUnit.M, 2592000000],

  // Weeks
  [TimeUnit.weeks, 604800000],
  [TimeUnit.week, 604800000],
  [TimeUnit.wks, 604800000],
  [TimeUnit.wk, 604800000],
  [TimeUnit.w, 604800000],

  // Days
  [TimeUnit.days, 86400000],
  [TimeUnit.day, 86400000],
  [TimeUnit.dys, 86400000],
  [TimeUnit.d, 86400000],

  // Hours
  [TimeUnit.hours, 3600000],
  [TimeUnit.hour, 3600000],
  [TimeUnit.hrs, 3600000],
  [TimeUnit.hr, 3600000],
  [TimeUnit.h, 3600000],

  // Minutes
  [TimeUnit.minutes, 60000],
  [TimeUnit.minute, 60000],
  [TimeUnit.mins, 60000],
  [TimeUnit.min, 60000],
  [TimeUnit.m, 60000],

  // Seconds
  [TimeUnit.seconds, 1000],
  [TimeUnit.second, 1000],
  [TimeUnit.secs, 1000],
  [TimeUnit.sec, 1000],
  [TimeUnit.s, 1000],

  // Milliseconds
  [TimeUnit.milliseconds, 1],
  [TimeUnit.msec, 1],
  [TimeUnit.mss, 1],
  [TimeUnit.ms, 1],
]);
