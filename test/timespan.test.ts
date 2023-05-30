import { Timespan } from '../src/timespan';

describe('Timespan', () => {
  const start = new Date('2022-01-01T06:24:00Z');
  const end = new Date('2023-02-21T10:52:00Z');

  describe('start', () => {
    it('should return the start date', () => {
      const timespan = new Timespan(start, end);
      expect(timespan.start).toBe(start);
    });
  });

  describe('end', () => {
    it('should return the end date', () => {
      const timespan = new Timespan(start, end);
      expect(timespan.end).toBe(end);
    });
  });

  describe('toTimeframe', () => {
    it('should return the time span in milliseconds', () => {
      const timespan = new Timespan(start, end);
      const timeframe = timespan.toTimeframe();
      expect(timeframe.milliseconds).toBe(200);
    });

    it('should return the time span in seconds', () => {
      const timespan = new Timespan(start, end);
      const timeframe = timespan.toTimeframe();
      expect(timeframe.seconds).toBe(43);
    });

    it('should return the time span in minutes', () => {
      const timespan = new Timespan(start, end);
      const timeframe = timespan.toTimeframe();
      expect(timeframe.minutes).toBe(58);
    });

    it('should return the time span in hours', () => {
      const timespan = new Timespan(start, end);
      const timeframe = timespan.toTimeframe();
      expect(timeframe.hours).toBe(17);
    });

    it('should return the time span in days', () => {
      const timespan = new Timespan(start, end);
      const timeframe = timespan.toTimeframe();
      expect(timeframe.days).toBe(6);
    });

    it('should return the time span in weeks', () => {
      const timespan = new Timespan(start, end);
      const timeframe = timespan.toTimeframe();
      expect(timeframe.weeks).toBe(2);
    });

    it('should return the time span in months', () => {
      const timespan = new Timespan(start, end);
      const timeframe = timespan.toTimeframe();
      expect(timeframe.months).toBe(1);
    });

    it('should return the time span in years', () => {
      const timespan = new Timespan(start, end);
      const timeframe = timespan.toTimeframe();
      expect(timeframe.years).toBe(1);
    });
  });

  describe('toString', () => {
    it('should return the string representation of the timespan', () => {
      const timespan = new Timespan(start, end);
      expect(timespan.toString()).toBe('1y 1M 2w 6d 17h 58m 43s 200ms');
    });
  });

  describe('toMilliseconds', () => {
    it('should return the time span in milliseconds', () => {
      const timespan = new Timespan(start, end);
      expect(timespan.toMilliseconds()).toBe(35958480000);
    });
  });

  describe('toSeconds', () => {
    it('should return the time span in seconds', () => {
      const timespan = new Timespan(start, end);
      expect(timespan.toSeconds()).toBe(35958480);
    });
  });

  describe('toMinutes', () => {
    it('should return the time span in minutes', () => {
      const timespan = new Timespan(start, end);
      expect(timespan.toMinutes()).toBe(599308);
    });
  });

  describe('toHours', () => {
    it('should return the time span in hours', () => {
      const timespan = new Timespan(start, end);
      expect(timespan.toHours()).toBe(9988.466666666667);
    });
  });

  describe('toDays', () => {
    it('should return the time span in days', () => {
      const timespan = new Timespan(start, end);
      expect(timespan.toDays()).toBe(416.18611111111113);
    });
  });

  describe('toWeeks', () => {
    it('should return the time span in weeks', () => {
      const timespan = new Timespan(start, end);
      expect(timespan.toWeeks()).toBe(59.455158730158736);
    });
  });

  describe('toMonths', () => {
    it('should return the time span in months', () => {
      const timespan = new Timespan(start, end);
      expect(timespan.toMonths()).toBe(13.673690281930254);
    });
  });

  describe('toYears', () => {
    it('should return the time span in years', () => {
      const timespan = new Timespan(start, end);
      expect(timespan.toYears()).toBe(1.1402359208523594);
    });
  });

  describe('fromString', () => {
    const dataset = [
      '!',
      '@',
      '#',
      '$',
      '%',
      '^',
      '&',
      '*',
      '(',
      ')',
      '~',
      '+',
      '-',
      '=',
      '[',
      ']',
      '{',
      '}',
      '|',
      '\\',
      ';',
      ':',
      "'",
      '"',
      ',',
      '.',
      '<',
      '>',
      '?',
      '/',
      '*',
      '^',
      '#',
      '你',
      '好',
      '世',
      '界',
    ];

    it('should create a Timespan object from a valid string input', () => {
      const timespan = Timespan.fromString('1y 2M 3w 4d 5h 6m 7s 8ms');

      // Check the properties of the Timespan object
      expect(timespan.toYears()).toBe(1.2358536468797565);
      expect(timespan.toMonths()).toBe(14.820336469136613);
      expect(timespan.toWeeks()).toBe(64.44094015873016);
      expect(timespan.toDays()).toBe(451.0865811111111);
      expect(timespan.toHours()).toBe(10826.077946666666);
      expect(timespan.toMinutes()).toBe(649564.6768);
      expect(timespan.toSeconds()).toBe(38973880.608);
      expect(timespan.toMilliseconds()).toBe(38973880608);

      // Check the string representation of the Timespan object
      expect(timespan.toString()).toBe('1y 2M 3w 4d 5h 6m 7s 8ms');
    });

    it('should handle singular and plural units', () => {
      const timespan = Timespan.fromString('2years 1month 3weeks 4days');

      // Check the properties of the Timespan object
      expect(timespan.toYears()).toBe(2.151882191780822);
      expect(timespan.toMonths()).toBe(25.805335611262606);
      expect(timespan.toWeeks()).toBe(112.20528571428572);
      expect(timespan.toDays()).toBe(785.437);

      // Check the string representation of the Timespan object
      expect(timespan.toString()).toBe('2y 1M 3w 4d');
    });

    it('should handle different unit abbreviations', () => {
      const timespan = Timespan.fromString(
        '1yr 2mos 3wks 4dys 5hrs 6mins 7secs 8mss',
      );

      // Check the properties of the Timespan object
      expect(timespan.toYears()).toBe(1.2358536468797565);
      expect(timespan.toMonths()).toBe(14.820336469136613);
      expect(timespan.toWeeks()).toBe(64.44094015873016);
      expect(timespan.toDays()).toBe(451.0865811111111);
      expect(timespan.toHours()).toBe(10826.077946666666);
      expect(timespan.toMinutes()).toBe(649564.6768);
      expect(timespan.toSeconds()).toBe(38973880.608);
      expect(timespan.toMilliseconds()).toBe(38973880608);

      // Check the string representation of the Timespan object
      expect(timespan.toString()).toBe('1y 2M 3w 4d 5h 6m 7s 8ms');
    });

    it('should throw an error for an invalid unit', () => {
      expect(() => {
        Timespan.fromString('1y 2M 3w 4d 5x');
      }).toThrow('Invalid unit: 5x');
    });

    it('should throw an error for invalid unit', () => {
      expect(() => Timespan.fromString('5 unknownUnit')).toThrowError(
        'Invalid unit',
      );
    });

    it('should throw an error for input exceeding mac length', () => {
      expect(() => Timespan.fromString(''.padEnd(100, '1'))).toThrowError(
        'Invalid input string',
      );
    });

    it.each(dataset)(
      'should throw an error for input that contains invalid character ($)',
      (character) => {
        expect(() => Timespan.fromString(character)).toThrowError(
          'Invalid input string',
        );
      },
    );

    it('should throw an error for input that contains invalid character @', () => {
      expect(() => Timespan.fromString(' Hello World')).toThrowError(
        'Invalid unit',
      );
    });

    it('should throw an error for input that contains invalid character @', () => {
      expect(() => Timespan.fromString('Hello\tWorld')).toThrowError(
        'Invalid unit',
      );
    });

    it('should throw an error for input that contains invalid character @', () => {
      expect(() => Timespan.fromString('Hello\nWorld')).toThrowError(
        'Invalid unit',
      );
    });
  });
});
