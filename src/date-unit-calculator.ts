import { DateUnitConversionTable } from './date-unit-conversion-map';
import { TimeUnit } from './units-of-time';

/**
 * Internal shared conversion table used by all date unit calculations.
 */
const conversionTable = new DateUnitConversionTable();

/**
 * Validates that the input is a valid `Date`.
 * @param date - The date to validate.
 * @throws Error if the input is not a valid date.
 */
function validateDateInput(date: Date): void {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date input.');
  }
}

/**
 * Validates that the value is non-negative.
 * @param value - The value to validate.
 * @throws Error if the value is negative.
 */
function validateNonNegativeUnitInput(value: number): void {
  if (value < 0) {
    throw new Error(`Invalid unit input ${value}.`);
  }
}

/**
 * Validates that the start date is not after the end date.
 * @param startDate - The start date.
 * @param endDate - The end date.
 * @throws Error if the start date is after the end date.
 */
function validateDateRange(startDate: Date, endDate: Date): void {
  if (startDate.getTime() > endDate.getTime()) {
    throw new Error('Start date cannot be greater than end date.');
  }
}

/**
 * Validates that the given unit is part of the time unit conversion table.
 * @param unit - The time unit to validate.
 * @throws Error if the unit is not recognized.
 */
function validateUnitInput(unit: TimeUnit): void {
  if (!conversionTable.getTimeUnits().includes(unit)) {
    throw new Error(`Invalid date unit: ${unit}.`);
  }
}

/**
 * Throws if input to `addUnits` is invalid.
 * @param value - The number of units to add.
 * @param startDate - The start date.
 */
function throwIfInvalidAdditionInput(value: number, startDate: Date): void {
  validateDateInput(startDate);
  validateNonNegativeUnitInput(value);
}

/**
 * Throws if input to `between` is invalid.
 * @param startDate - The start date.
 * @param endDate - The end date.
 */
function throwIfInvalidBetweenInput(startDate: Date, endDate: Date): void {
  validateDateInput(startDate);
  validateDateInput(endDate);
  validateDateRange(startDate, endDate);
}

/**
 * Retrieves the number of milliseconds per unit for the specified unit.
 * @param unit - The unit to retrieve the milliseconds per unit for.
 * @returns The number of milliseconds in one unit.
 */
export function millisecondsPerUnit(unit: TimeUnit): number {
  validateUnitInput(unit);
  return conversionTable.get(unit).millisecondsPerUnit;
}

/**
 * Retrieves the plural form of the specified time unit.
 * @param unit - The unit to convert to plural form.
 * @returns The plural form of the unit.
 */
export function pluralUnit(unit: TimeUnit): string {
  validateUnitInput(unit);
  return conversionTable.get(unit).plural;
}

/**
 * Retrieves the abbreviated form of the specified unit.
 * @param unit - The unit to retrieve the abbreviation for.
 * @returns The abbreviated string for the unit.
 */
export function abbreviatedUnit(unit: TimeUnit): string {
  validateUnitInput(unit);
  return conversionTable.get(unit).abbreviation;
}

/**
 * Adds the specified number of units to a given date.
 * @param unit - The unit type to add (e.g., 'days', 'months').
 * @param value - The number of units to add.
 * @param startDate - The start date.
 * @returns A new `Date` object with the units added.
 * @throws Error if inputs are invalid.
 */
export function addUnits(unit: TimeUnit, value: number, startDate: Date): Date {
  throwIfInvalidAdditionInput(value, startDate);
  validateUnitInput(unit);
  return conversionTable.get(unit).add(value, startDate);
}

/**
 * Calculates the number of whole units between two dates.
 * @param unit - The unit to measure in (e.g., 'weeks', 'years').
 * @param startDate - The start date.
 * @param endDate - The end date.
 * @returns The number of full units between the two dates.
 * @throws Error if the input dates are invalid or reversed.
 */
export function between(
  unit: TimeUnit,
  startDate: Date,
  endDate: Date,
): number {
  throwIfInvalidBetweenInput(startDate, endDate);
  validateUnitInput(unit);
  return conversionTable.get(unit).between(startDate, endDate);
}
