/**
 * Represents a converter for a specific date unit.
 */
export interface DateUnitConverter {
  /**
   * The default name of the date unit.
   */
  default: string;

  /**
   * The plural name of the date unit.
   */
  plural: string;

  /**
   * The abbreviated name of the date unit.
   */
  abbreviation: string;

  /**
   * An array of aliases for the date unit.
   */
  aliases: Array<string>;

  /**
   * The number of milliseconds per unit for conversions.
   */
  millisecondsPerUnit: number;

  /**
   * Calculates the number of units between two dates.
   * @param startDate - The start date.
   * @param endDate - The end date.
   * @returns The number of units between the two dates.
   */
  between(startDate: Date, endDate: Date): number;

  /**
   * Adds the specified number of units to the given date.
   * @param value - The number of units to add.
   * @param startDate - The start date.
   * @returns The new date after adding the units.
   */
  add(value: number, startDate: Date): Date;
}
