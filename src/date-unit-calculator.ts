import { DateUnitConversionTable } from './date-unit-conversion-map';
import { TimeUnit } from './units-of-time';

/**
 * Calculator for calculating date unit conversions.
 */
export class DateUnitCalculator {
  /**
   * The conversion table containing the date unit converters.
   */
  private readonly conversionTable: DateUnitConversionTable;

  private readonly timeUnitKeys: TimeUnit[] = [];

  /**
   * Constructs a new DateUnitCalculator instance.
   */
  public constructor() {
    this.conversionTable = new DateUnitConversionTable();
    this.timeUnitKeys = this.timeUnitKeys.concat(
      this.conversionTable.get('years').aliases as TimeUnit[],
      this.conversionTable.get('months').aliases as TimeUnit[],
      this.conversionTable.get('weeks').aliases as TimeUnit[],
      this.conversionTable.get('days').aliases as TimeUnit[],
      this.conversionTable.get('hours').aliases as TimeUnit[],
      this.conversionTable.get('minutes').aliases as TimeUnit[],
      this.conversionTable.get('seconds').aliases as TimeUnit[],
      this.conversionTable.get('milliseconds').aliases as TimeUnit[],
    );
  }

  /**
   * Retrieves the number of milliseconds per unit for the specified unit.
   * @param unit - The unit to retrieve the milliseconds per unit for.
   * @returns The number of milliseconds per unit.
   */
  public millisecondsPerUnit(unit: TimeUnit): number {
    this.validateUnitInput(unit);
    return this.conversionTable.get(unit).millisecondsPerUnit;
  }

  /**
   * Retrieves the plural form of the specified unit.
   * @param unit - The unit to retrieve the plural form for.
   * @returns The plural form of the unit.
   */
  public pluralUnit(unit: TimeUnit): string {
    this.validateUnitInput(unit);
    return this.conversionTable.get(unit).plural;
  }

  /**
   * Retrieves the abbreviated form of the specified unit.
   * @param unit - The unit to retrieve the abbreviated form for.
   * @returns The abbreviated form of the unit.
   */
  public abbreviatedUnit(unit: TimeUnit): string {
    this.validateUnitInput(unit);
    return this.conversionTable.get(unit).abbreviation;
  }

  /**
   * Adds the specified number of units to the given date.
   * @param unit - The unit to add.
   * @param value - The number of units to add.
   * @param startDate - The start date.
   * @returns The new date after adding the units.
   */
  public addUnits(unit: TimeUnit, value: number, startDate: Date): Date {
    DateUnitCalculator.throwIfInvalidAdditionInput(value, startDate);
    this.validateUnitInput(unit);
    return this.conversionTable.get(unit).add(value, startDate);
  }

  /**
   * Calculates the number of units between two dates.
   * @param unit - The unit to calculate.
   * @param startDate - The start date.
   * @param endDate - The end date.
   * @returns The number of units between the two dates.
   */
  public between(unit: TimeUnit, startDate: Date, endDate: Date): number {
    DateUnitCalculator.throwIfInvalidBetweenInput(startDate, endDate);
    this.validateUnitInput(unit);
    return this.conversionTable.get(unit).between(startDate, endDate);
  }

  private static validateDateRange(startDate: Date, endDate: Date): void {
    if (startDate.getTime() > endDate.getTime()) {
      throw new Error('Start date cannot be greater than end date.');
    }
  }

  private static validateNonNegativeUnitInput(value: number): void {
    if (value < 0) {
      throw new Error(`Invalid unit input ${value}.`);
    }
  }

  private static validateDateInput(date: Date): void {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid date input.');
    }
  }

  private validateUnitInput(unit: TimeUnit): void {
    if (!this.timeUnitKeys.includes(unit)) {
      throw new Error(`Invalid date unit: ${unit}.`);
    }
  }

  private static throwIfInvalidAdditionInput(value: number, startDate: Date) {
    DateUnitCalculator.validateDateInput(startDate);
    DateUnitCalculator.validateNonNegativeUnitInput(value);
  }

  private static throwIfInvalidBetweenInput(
    startDate: Date,
    endDate: Date,
  ): void {
    DateUnitCalculator.validateDateInput(startDate);
    DateUnitCalculator.validateDateInput(endDate);
    DateUnitCalculator.validateDateRange(startDate, endDate);
  }
}
