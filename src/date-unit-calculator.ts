import { DateUnitConversionTable } from './date-unit-conversion-map';
import { TimeUnit } from './time-unit';

/**
 * Calculator for calculating date unit conversions.
 */
export class DateUnitCalculator {
  /**
   * The conversion table containing the date unit converters.
   */
  private conversionTable: DateUnitConversionTable;

  /**
   * Constructs a new DateUnitCalculator instance.
   */
  public constructor() {
    this.conversionTable = new DateUnitConversionTable();
  }

  /**
   * Calculates the number of units between two dates.
   * @param startDate - The start date.
   * @param endDate - The end date.
   * @param unit - The unit to calculate.
   * @returns The number of units between the two dates.
   */
  public calculateUnitBetween(
    startDate: Date,
    endDate: Date,
    unit: TimeUnit,
  ): number {
    const converter = this.conversionTable.get(unit);
    return converter.between(startDate, endDate);
  }

  /**
   * Retrieves the number of milliseconds per unit for the specified unit.
   * @param unit - The unit to retrieve the milliseconds per unit for.
   * @returns The number of milliseconds per unit.
   */
  public millisecondsPerUnit(unit: TimeUnit): number {
    return this.conversionTable.get(unit).millisecondsPerUnit;
  }

  /**
   * Retrieves the plural form of the specified unit.
   * @param unit - The unit to retrieve the plural form for.
   * @returns The plural form of the unit.
   */
  public pluralUnit(unit: TimeUnit): string {
    return this.conversionTable.get(unit).plural;
  }

  /**
   * Retrieves the abbreviated form of the specified unit.
   * @param unit - The unit to retrieve the abbreviated form for.
   * @returns The abbreviated form of the unit.
   */
  public abbreviatedUnit(unit: TimeUnit): string {
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
    return this.conversionTable.get(unit).between(startDate, endDate);
  }
}
