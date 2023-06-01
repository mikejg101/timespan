import { DateUnitCalculator } from '../src/date-unit-calculator';

describe('DateUnitCalculator', () => {
  let dateUnitCalculator: DateUnitCalculator;

  beforeEach(() => {
    dateUnitCalculator = new DateUnitCalculator();
  });

  describe('calculateUnitBetween', () => {
    it('should calculate the number of units between two dates', () => {
      const startDate = new Date('2022-01-01T00:00:00');
      const endDate = new Date('2022-01-31T23:59:59');
      const result = dateUnitCalculator.calculateUnitBetween(
        startDate,
        endDate,
        'day',
      );
      expect(result).toBe(30);
    });
  });

  describe('millisecondsPerUnit', () => {
    it('should return the number of milliseconds per unit', () => {
      const result = dateUnitCalculator.millisecondsPerUnit('hour');
      expect(result).toBe(3600000); // 1 hour = 3600000 milliseconds
    });
  });

  describe('pluralUnit', () => {
    it('should return the plural form of the unit', () => {
      const result = dateUnitCalculator.pluralUnit('minute');
      expect(result).toBe('minutes');
    });
  });

  describe('abbreviatedUnit', () => {
    it('should return the abbreviated form of the unit', () => {
      const result = dateUnitCalculator.abbreviatedUnit('month');
      expect(result).toBe('M');
    });
  });

  describe('addUnits', () => {
    it('should add the specified number of units to a date', () => {
      const startDate = new Date('2023-01-01T00:00:00');
      const result = dateUnitCalculator.addUnits('year', 3, startDate);
      expect(result).toEqual(new Date('2026-01-01T00:00:00'));
    });
  });

  describe('between', () => {
    it('should calculate the number of units between two dates', () => {
      const startDate = new Date('2022-01-01T00:00:00');
      const endDate = new Date('2022-01-31T23:59:59');
      const result = dateUnitCalculator.between('day', startDate, endDate);
      expect(result).toBe(30);
    });
    it('should calculate the unit between two dates', () => {
      const startDate = new Date('2023-05-01');
      const endDate = new Date('2023-08-01');
      const unit = 'month';
      const result = dateUnitCalculator.calculateUnitBetween(
        startDate,
        endDate,
        unit,
      );

      // Calculate the expected number of units (months) between the dates
      const expectedMonths =
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());

      // Check if the result matches the expected number of units
      expect(result).toBe(expectedMonths);
    });
  });
});
