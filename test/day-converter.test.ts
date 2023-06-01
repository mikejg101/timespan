import { DayConverter } from '../src/converters/day-converter';

describe('DayConverter', () => {
  let dayConverter: DayConverter;

  beforeEach(() => {
    dayConverter = new DayConverter();
  });

  describe('between', () => {
    it('should calculate the number of days between two dates', () => {
      const startDate = new Date('2023-05-01');
      const endDate = new Date('2023-05-31');
      const result = dayConverter.between(startDate, endDate);
      expect(result).toBe(30);
    });

    it('should throw an error for invalid date input', () => {
      const startDate = new Date('2023-05-01');
      const endDate = '2023-05-31' as any;
      expect(() => dayConverter.between(startDate, endDate)).toThrow(
        'Invalid date input.',
      );
    });

    it('should throw an error if the start date is greater than the end date', () => {
      const startDate = new Date('2023-06-01');
      const endDate = new Date('2023-05-31');
      expect(() => dayConverter.between(startDate, endDate)).toThrow(
        'Start date cannot be greater than end date.',
      );
    });
  });

  describe('add', () => {
    it('should add the specified number of days to a date', () => {
      const startDate = new Date('2023-05-01');
      const result = dayConverter.add(5, startDate);
      expect(result).toEqual(new Date('2023-05-06'));
    });

    it('should throw an error for invalid date input', () => {
      const startDate = '2023-05-01' as any;
      expect(() => dayConverter.add(5, startDate)).toThrow(
        'Invalid date input.',
      );
    });

    it('should throw an error for negative day input', () => {
      const startDate = new Date('2023-05-01');
      expect(() => dayConverter.add(-5, startDate)).toThrow(
        'Invalid day input.',
      );
    });
  });
});
