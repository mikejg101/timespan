import { SecondConverter } from '../src/converters/second-converter';

describe('SecondConverter', () => {
  let secondConverter: SecondConverter;

  beforeEach(() => {
    secondConverter = new SecondConverter();
  });

  describe('between', () => {
    it('should calculate the number of seconds between two dates', () => {
      const startDate = new Date('2023-05-01T00:00:00');
      const endDate = new Date('2023-05-01T00:00:10');
      const result = secondConverter.between(startDate, endDate);
      expect(result).toBe(10);
    });

    it('should throw an error for invalid date input', () => {
      const startDate = new Date('2023-05-01T00:00:00');
      const endDate = '2023-05-01T00:00:10' as any;
      expect(() => secondConverter.between(startDate, endDate)).toThrow(
        'Invalid date inputs.',
      );
    });

    it('should throw an error if the start date is greater than the end date', () => {
      const startDate = new Date('2023-05-01T00:00:10');
      const endDate = new Date('2023-05-01T00:00:00');
      expect(() => secondConverter.between(startDate, endDate)).toThrow(
        'Start date cannot be greater than end date.',
      );
    });
  });

  describe('add', () => {
    it('should add the specified number of seconds to a date', () => {
      const startDate = new Date('2023-05-01T00:00:00');
      const result = secondConverter.add(10, startDate);
      expect(result).toEqual(new Date('2023-05-01T00:00:10'));
    });

    it('should throw an error for invalid date input', () => {
      const startDate = '2023-05-01T00:00:00' as any;
      expect(() => secondConverter.add(10, startDate)).toThrow(
        'Invalid date input.',
      );
    });

    it('should throw an error for negative second input', () => {
      const startDate = new Date('2023-05-01T00:00:00');
      expect(() => secondConverter.add(-10, startDate)).toThrow(
        'Invalid second input.',
      );
    });
  });
});
