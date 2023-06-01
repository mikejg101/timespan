import { MinuteConverter } from '../src/converters/minute-converter';

describe('MinuteConverter', () => {
  let minuteConverter: MinuteConverter;

  beforeEach(() => {
    minuteConverter = new MinuteConverter();
  });

  describe('between', () => {
    it('should calculate the number of minutes between two dates', () => {
      const startDate = new Date('2023-05-01T12:00:00');
      const endDate = new Date('2023-05-01T12:30:00');
      const result = minuteConverter.between(startDate, endDate);
      expect(result).toBe(30);
    });

    it('should throw an error for invalid date input', () => {
      const startDate = new Date('2023-05-01T12:00:00');
      const endDate = '2023-05-01T12:30:00' as any;
      expect(() => minuteConverter.between(startDate, endDate)).toThrow(
        'Invalid date input.',
      );
    });

    it('should throw an error if the start date is greater than the end date', () => {
      const startDate = new Date('2023-05-01T12:30:00');
      const endDate = new Date('2023-05-01T12:00:00');
      expect(() => minuteConverter.between(startDate, endDate)).toThrow(
        'Start date cannot be greater than end date.',
      );
    });
  });

  describe('add', () => {
    it('should add the specified number of minutes to a date', () => {
      const startDate = new Date('2023-05-01T12:00:00');
      const result = minuteConverter.add(45, startDate);
      expect(result).toEqual(new Date('2023-05-01T12:45:00'));
    });

    it('should throw an error for invalid date input', () => {
      const startDate = '2023-05-01T12:00:00' as any;
      expect(() => minuteConverter.add(45, startDate)).toThrow(
        'Invalid date input.',
      );
    });

    it('should throw an error for negative minute input', () => {
      const startDate = new Date('2023-05-01T12:00:00');
      expect(() => minuteConverter.add(-45, startDate)).toThrow(
        'Invalid minute input.',
      );
    });
  });
});
