import {
  abbreviatedUnit,
  addUnits,
  between,
  millisecondsPerUnit,
  pluralUnit,
} from '../src/date-unit-calculator';

describe('DateUnitCalculator', () => {
  describe('calculateUnitBetween', () => {
    it('should calculate the number of units between two dates', () => {
      const startDate = new Date('2022-01-01T00:00:00');
      const endDate = new Date('2022-01-31T23:59:59');
      const result = between('day', startDate, endDate);
      expect(result).toBe(30);
    });
  });

  describe('millisecondsPerUnit', () => {
    it('should return the number of milliseconds per unit', () => {
      const result = millisecondsPerUnit('hour');
      expect(result).toBe(3600000); // 1 hour = 3600000 milliseconds
    });
  });

  describe('pluralUnit', () => {
    it('should return the plural form of the unit', () => {
      const result = pluralUnit('minute');
      expect(result).toBe('minutes');
    });
  });

  describe('abbreviatedUnit', () => {
    it('should return the abbreviated form of the unit', () => {
      const result = abbreviatedUnit('month');
      expect(result).toBe('M');
    });
  });

  describe('addUnits', () => {
    it('should add the specified number of units to a date', () => {
      const startDate = new Date('2023-01-01T00:00:00');
      const result = addUnits('year', 3, startDate);
      expect(result).toEqual(new Date('2026-01-01T00:00:00'));
    });
    it('should throw an error for invalid date input', () => {
      const startDate = '2023-05-01' as any;
      expect(() => addUnits('year', 5, startDate)).toThrow(
        'Invalid date input.',
      );
    });

    it('should throw an error for negative day input', () => {
      const startDate = new Date('2023-05-01');
      expect(() => addUnits('year', -5, startDate)).toThrow(
        'Invalid unit input -5.',
      );
    });
  });

  describe('between', () => {
    it('should calculate the number of units between two dates', () => {
      const startDate = new Date('2022-01-01T00:00:00');
      const endDate = new Date('2022-01-31T23:59:59');
      const result = between('day', startDate, endDate);
      expect(result).toBe(30);
    });
    it('should calculate the unit between two dates', () => {
      const startDate = new Date('2023-05-01');
      const endDate = new Date('2023-08-01');
      const unit = 'month';
      const result = between(unit, startDate, endDate);

      // Calculate the expected number of units (months) between the dates
      const expectedMonths =
        (endDate.getUTCFullYear() - startDate.getUTCFullYear()) * 12 +
        (endDate.getUTCMonth() - startDate.getUTCMonth());

      // Check if the result matches the expected number of units
      expect(result).toBe(expectedMonths);
    });
    it('should throw an error if the start date is greater than the end date', () => {
      const startDate = new Date('2023-06-01');
      const endDate = new Date('2023-05-31');
      const unit = 'month';
      expect(() => between(unit, startDate, endDate)).toThrow(
        'Start date cannot be greater than end date.',
      );
    });
  });
});
