const yearConversion = {
  default: 'year',
  plural: 'years',
  abbreviation: 'y',
  aliases: ['yrs', 'yr', 'y'],
  conversionFactor: 1000 * 60 * 60 * 24 * 365,
};

const monthConversion = {
  default: 'month',
  plural: 'months',
  abbreviation: 'M',
  aliases: ['mos', 'mo', 'M'],
  conversionFactor: 1000 * 60 * 60 * 24 * 30.437,
};

const weekConversion = {
  default: 'week',
  plural: 'weeks',
  abbreviation: 'w',
  aliases: ['wks', 'wk', 'w'],
  conversionFactor: 1000 * 60 * 60 * 24 * 7,
};

const dayConversion = {
  default: 'day',
  plural: 'days',
  abbreviation: 'd',
  aliases: ['dys', 'dy', 'd'],
  conversionFactor: 1000 * 60 * 60 * 24,
};

const hourConversion = {
  default: 'hour',
  plural: 'hours',
  abbreviation: 'h',
  aliases: ['hrs', 'hr', 'h'],
  conversionFactor: 1000 * 60 * 60,
};

const minuteConversion = {
  default: 'minute',
  plural: 'minutes',
  abbreviation: 'm',
  aliases: ['mins', 'min', 'm'],
  conversionFactor: 1000 * 60,
};
const secondConversion = {
  default: 'second',
  plural: 'seconds',
  abbreviation: 's',
  aliases: ['secs', 'sec', 's'],
  conversionFactor: 1000,
};
const millisecondConversion = {
  default: 'millisecond',
  plural: 'milliseconds',
  abbreviation: 'ms',
  aliases: ['msec', 'mss', 'ms'],
  conversionFactor: 1,
};

export const conversionTable = {
  // Years
  years: yearConversion,
  year: yearConversion,
  yrs: yearConversion,
  yr: yearConversion,
  y: yearConversion,

  // Months
  months: monthConversion,
  month: monthConversion,
  mos: monthConversion,
  mo: monthConversion,
  M: monthConversion,

  // Weeks
  weeks: weekConversion,
  week: weekConversion,
  wks: weekConversion,
  wk: weekConversion,
  w: weekConversion,

  // Days
  days: dayConversion,
  day: dayConversion,
  dys: dayConversion,
  d: dayConversion,

  // Hours
  hours: hourConversion,
  hour: hourConversion,
  hrs: hourConversion,
  hr: hourConversion,
  h: hourConversion,

  // Minutes
  minutes: minuteConversion,
  minute: minuteConversion,
  mins: minuteConversion,
  min: minuteConversion,
  m: minuteConversion,

  // Seconds
  seconds: secondConversion,
  second: secondConversion,
  secs: secondConversion,
  sec: secondConversion,
  s: secondConversion,

  // Milliseconds
  milliseconds: millisecondConversion,
  msec: millisecondConversion,
  mss: millisecondConversion,
  ms: millisecondConversion,
};
