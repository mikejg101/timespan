import { WeekConverter } from '../src/converters/week-converter';

describe('WeekConverter', () => {
  let weekConverter: WeekConverter;

  beforeEach(() => {
    weekConverter = new WeekConverter();
  });

  describe('between', () => {
    it('should calculate the number of weeks between two dates', () => {
      const startDate = new Date('2023-05-01T00:00:00');
      const endDate = new Date('2023-05-15T00:00:00');
      const result = weekConverter.between(startDate, endDate);
      expect(result).toBe(2);
    });

    it('should throw an error for invalid date input', () => {
      const startDate = new Date('2023-05-01T00:00:00');
      const endDate = '2023-05-15T00:00:00' as any;
      expect(() => weekConverter.between(startDate, endDate)).toThrow(
        'Invalid date inputs.',
      );
    });

    it('should throw an error if the start date is greater than the end date', () => {
      const startDate = new Date('2023-05-15T00:00:00');
      const endDate = new Date('2023-05-01T00:00:00');
      expect(() => weekConverter.between(startDate, endDate)).toThrow(
        'Start date cannot be greater than end date.',
      );
    });
  });

  describe('add', () => {
    it('should add the specified number of weeks to a date', () => {
      const startDate = new Date('2023-05-01T00:00:00');
      const result = weekConverter.add(2, startDate);
      expect(result).toEqual(new Date('2023-05-15T00:00:00'));
    });

    it('should throw an error for invalid date input', () => {
      const startDate = '2023-05-01T00:00:00' as any;
      expect(() => weekConverter.add(2, startDate)).toThrow(
        'Invalid date input.',
      );
    });

    it('should throw an error for negative week input', () => {
      const startDate = new Date('2023-05-01T00:00:00');
      expect(() => weekConverter.add(-2, startDate)).toThrow(
        'Invalid week input.',
      );
    });
  });
});
