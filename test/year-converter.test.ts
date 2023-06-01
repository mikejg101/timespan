import { YearConverter } from '../src/converters/year-converter';

describe('YearConverter', () => {
  let yearConverter: YearConverter;

  beforeEach(() => {
    yearConverter = new YearConverter();
  });

  describe('between', () => {
    it('should calculate the number of years between two dates', () => {
      const startDate = new Date('2020-01-01T00:00:00');
      const endDate = new Date('2023-01-01T00:00:00');
      const result = yearConverter.between(startDate, endDate);
      expect(result).toBe(3);
    });

    it('should throw an error for invalid date input', () => {
      const startDate = new Date('2020-01-01T00:00:00');
      const endDate = '2023-01-01T00:00:00' as any;
      expect(() => yearConverter.between(startDate, endDate)).toThrow(
        'Invalid date inputs.',
      );
    });

    it('should throw an error if the start date is greater than the end date', () => {
      const startDate = new Date('2023-01-01T00:00:00');
      const endDate = new Date('2020-01-01T00:00:00');
      expect(() => yearConverter.between(startDate, endDate)).toThrow(
        'Start date cannot be greater than end date.',
      );
    });
    it('should calculate the correct number of years when range falls within a leap year', () => {
      const startDate = new Date('2020-02-29T00:00:00');
      const endDate = new Date('2024-02-29T00:00:00');
      const result = yearConverter.between(startDate, endDate);
      expect(result).toEqual(4);
    });

    it('should calculate the correct number of years when range does not fall within a leap year', () => {
      const startDate = new Date('2021-02-28T00:00:00');
      const endDate = new Date('2024-02-28T00:00:00');
      const result = yearConverter.between(startDate, endDate);
      expect(result).toEqual(3);
    });

    it('should throw an error for invalid date inputs', () => {
      const invalidStartDate = new Date('invalid');
      const endDate = new Date('2024-02-28T00:00:00');
      expect(() => {
        yearConverter.between(invalidStartDate, endDate);
      }).toThrow();
    });

    it('should increment totalYears when range covers a leap year', () => {
      const startDate = new Date('2020-01-01');
      const endDate = new Date('2020-12-31');
      const result = yearConverter.between(startDate, endDate);
      expect(result).toEqual(1);
    });

    it('should throw an error when start date is greater than end date', () => {
      const startDate = new Date('2024-02-28T00:00:00');
      const endDate = new Date('2021-02-28T00:00:00');
      expect(() => {
        yearConverter.between(startDate, endDate);
      }).toThrow('Start date cannot be greater than end date.');
    });
  });

  describe('add', () => {
    it('should add the specified number of years to a date', () => {
      const startDate = new Date('2020-01-01T00:00:00Z');
      const result = yearConverter.add(3, startDate);

      expect(result.getUTCFullYear()).toBe(2023);
      expect(result.getUTCMonth()).toBe(0); // January (0-indexed)
      expect(result.getUTCDate()).toBe(1);
    });

    it('should handle leap years correctly', () => {
      const startDate = new Date('2020-02-29T00:00:00');
      const result = yearConverter.add(4, startDate);
      expect(result).toEqual(new Date('2024-02-29T00:00:00'));
    });

    it('should throw an error for invalid date input', () => {
      const startDate = '2020-01-01T00:00:00' as any;
      expect(() => yearConverter.add(3, startDate)).toThrow(
        'Invalid date input.',
      );
    });

    it('should throw an error for negative year input', () => {
      const startDate = new Date('2020-01-01T00:00:00');
      expect(() => yearConverter.add(-3, startDate)).toThrow(
        'Invalid year input.',
      );
    });

    it('should handle February 29th when adding years to a date', () => {
      const startDate = new Date('2020-02-29T00:00:00');
      const targetYear = 2021; // A non-leap year
      const result = yearConverter.add(1, startDate);

      // Check if the result is February 28th of the target year
      expect(result.getFullYear()).toBe(targetYear);
      expect(result.getMonth()).toBe(1); // February is month 1 (zero-based index)
      expect(result.getDate()).toBe(28);
    });
  });
});
