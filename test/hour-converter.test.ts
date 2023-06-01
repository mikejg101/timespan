import { HourConverter } from '../src/converters/hour-converter';

describe('HourConverter', () => {
  let hourConverter: HourConverter;

  beforeEach(() => {
    hourConverter = new HourConverter();
  });

  describe('between', () => {
    it('should calculate the number of hours between two dates', () => {
      const startDate = new Date('2023-05-01T12:00:00');
      const endDate = new Date('2023-05-02T06:30:00');
      const result = hourConverter.between(startDate, endDate);
      expect(result).toBe(18);
    });

    it('should throw an error for invalid date input', () => {
      const startDate = new Date('2023-05-01T12:00:00');
      const endDate = '2023-05-02T06:30:00' as any;
      expect(() => hourConverter.between(startDate, endDate)).toThrow(
        'Invalid date input.',
      );
    });

    it('should throw an error if the start date is greater than the end date', () => {
      const startDate = new Date('2023-05-02T06:30:00');
      const endDate = new Date('2023-05-01T12:00:00');
      expect(() => hourConverter.between(startDate, endDate)).toThrow(
        'Start date cannot be greater than end date.',
      );
    });
  });

  describe('add', () => {
    it('should add the specified number of hours to a date', () => {
      const startDate = new Date('2023-05-01T12:00:00');
      const result = hourConverter.add(3.5, startDate);
      expect(result).toEqual(new Date('2023-05-01T15:30:00'));
    });

    it('should throw an error for invalid date input', () => {
      const startDate = '2023-05-01T12:00:00' as any;
      expect(() => hourConverter.add(3.5, startDate)).toThrow(
        'Invalid date input.',
      );
    });

    it('should throw an error for negative hour input', () => {
      const startDate = new Date('2023-05-01T12:00:00');
      expect(() => hourConverter.add(-3.5, startDate)).toThrow(
        'Invalid hour input.',
      );
    });
  });
});
