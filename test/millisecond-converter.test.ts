import { MillisecondConverter } from '../src/converters/millisecond-convert';

describe('MillisecondConverter', () => {
  let millisecondConverter: MillisecondConverter;

  beforeEach(() => {
    millisecondConverter = new MillisecondConverter();
  });

  describe('between', () => {
    it('should calculate the difference in milliseconds between two dates', () => {
      const startDate = new Date('2023-05-01T12:00:00');
      const endDate = new Date('2023-05-01T12:00:01.500');
      const result = millisecondConverter.between(startDate, endDate);
      expect(result).toBe(1500);
    });

    it('should throw an error for invalid date input', () => {
      const startDate = new Date('2023-05-01T12:00:00');
      const endDate = '2023-05-01T12:00:01.500' as any;
      expect(() => millisecondConverter.between(startDate, endDate)).toThrow(
        'Invalid date input.',
      );
    });

    it('should throw an error if the start date is greater than the end date', () => {
      const startDate = new Date('2023-05-01T12:00:01.500');
      const endDate = new Date('2023-05-01T12:00:00');
      expect(() => millisecondConverter.between(startDate, endDate)).toThrow(
        'Start date cannot be greater than end date.',
      );
    });
  });

  describe('add', () => {
    it('should add the specified number of milliseconds to a date', () => {
      const startDate = new Date('2023-05-01T12:00:00');
      const result = millisecondConverter.add(500, startDate);
      expect(result).toEqual(new Date('2023-05-01T12:00:00.500'));
    });

    it('should throw an error for invalid date input', () => {
      const startDate = '2023-05-01T12:00:00' as any;
      expect(() => millisecondConverter.add(500, startDate)).toThrow(
        'Invalid date input.',
      );
    });

    it('should throw an error for negative millisecond input', () => {
      const startDate = new Date('2023-05-01T12:00:00');
      expect(() => millisecondConverter.add(-500, startDate)).toThrow(
        'Invalid millisecond input.',
      );
    });
  });
});
