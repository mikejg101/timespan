/**
 * Object that maps time units to their corresponding multipliers in milliseconds.
 * Precomputed values for efficient conversion.
 */
export const unitMultipliers: Record<string, number> = {
  /**
   * Milliseconds
   */
  ms: 1,
  /**
   * Milliseconds
   */
  mss: 1,
  /**
   * Milliseconds
   */
  msec: 1,
  /**
   * Milliseconds
   */
  milliseconds: 1,
  /**
   * Seconds
   */
  s: 1000,
  /**
   * Seconds
   */
  sec: 1000,
  /**
   * Seconds
   */
  secs: 1000,
  /**
   * Seconds
   */
  second: 1000,
  /**
   * Seconds
   */
  seconds: 1000,
  /**
   * Minutes
   */
  m: 60000,
  /**
   * Minutes
   */
  min: 60000,
  /**
   * Minutes
   */
  mins: 60000,
  /**
   * Minutes
   */
  minute: 60000,
  /**
   * Minutes
   */
  minutes: 60000,
  /**
   * Hours
   */
  h: 3600000,
  /**
   * Hours
   */
  hr: 3600000,
  /**
   * Hours
   */
  hrs: 3600000,
  /**
   * Hours
   */
  hour: 3600000,
  /**
   * Hours
   */
  hours: 3600000,
  /**
   * Days
   */
  d: 86400000,
  /**
   * Days
   */
  dys: 86400000,
  /**
   * Days
   */
  day: 86400000,
  /**
   * Days
   */
  days: 86400000,

  /**
   * Weeks
   */
  w: 604800000,
  /**
   * Weeks
   */
  wk: 604800000,
  /**
   * Weeks
   */
  wks: 604800000,
  /**
   * Weeks
   */
  week: 604800000,
  /**
   * Weeks
   */
  weeks: 604800000,
  /**
   * Months
   */
  M: 2592000000,
  /**
   * Months
   */
  mo: 2592000000,
  /**
   * Months
   */
  mos: 2592000000,
  /**
   * Months
   */
  month: 2592000000,
  /**
   * Months
   */
  months: 2592000000,
  /**
   * Years
   */
  y: 31536000000,
  /**
   * Years
   */
  yr: 31536000000,
  /**
   * Years
   */
  yrs: 31536000000,
  /**
   * Years
   */
  year: 31536000000,
  /**
   * Years
   */
  years: 31536000000,
};
