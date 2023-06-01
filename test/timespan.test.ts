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
      expect(timeframe.milliseconds).toBe(0);
    });

    it('should return the time span in seconds', () => {
      const timespan = new Timespan(start, end);
      const timeframe = timespan.toTimeframe();
      expect(timeframe.seconds).toBe(0);
    });

    it('should return the time span in minutes', () => {
      const timespan = new Timespan(start, end);
      const timeframe = timespan.toTimeframe();
      expect(timeframe.minutes).toBe(28);
    });

    it('should return the time span in hours', () => {
      const timespan = new Timespan(start, end);
      const timeframe = timespan.toTimeframe();
      expect(timeframe.hours).toBe(4);
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
      expect(timespan.toString()).toBe('1y 1M 2w 6d 4h 28m');
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
      expect(timespan.toHours()).toBe(9988);
    });
  });

  describe('toDays', () => {
    it('should return the time span in days', () => {
      const timespan = new Timespan(start, end);
      expect(timespan.toDays()).toBe(416);
    });
  });

  describe('toWeeks', () => {
    it('should return the time span in weeks', () => {
      const timespan = new Timespan(start, end);
      expect(timespan.toWeeks()).toBe(59);
    });
  });

  describe('toMonths', () => {
    it('should return the time span in months', () => {
      const timespan = new Timespan(start, end);
      expect(timespan.toMonths()).toBe(13);
    });
  });

  describe('toYears', () => {
    it('should return the time span in years', () => {
      const timespan = new Timespan(start, end);
      expect(timespan.toYears()).toBe(1);
    });
  });

  describe('fromString', () => {
    const blacklistedCharacters = [
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

    const allowedStrings = [
      [
        '1years 1months 2weeks 5days 17hours 58minutes 43seconds 200milliseconds',
        '1y 1M 2w 5d 17h 58m 43s 200ms',
      ],
      [
        '1year 1month 2week 5day 17hour 58minute 43second 200millisecond',
        '1y 1M 2w 5d 17h 58m 43s 200ms',
      ],
      [
        '1yrs 1mos 2wks 5dys 17hrs 58mins 43secs 200msec',
        '1y 1M 2w 5d 17h 58m 43s 200ms',
      ],
      [
        '1yr 1mo 2wk 5dy 17hr 58min 43sec 200mss',
        '1y 1M 2w 5d 17h 58m 43s 200ms',
      ],
      ['1y 1M 2w 5d 17h 58m 43s 200ms', '1y 1M 2w 5d 17h 58m 43s 200ms'],
    ];

    it('should create a Timespan object from a valid string input', () => {
      const timespan = Timespan.fromString('1y 2M 3w 4d 5h 6m 7s 8ms');

      // Check the properties of the Timespan object
      expect(timespan.toYears()).toBe(1);
      expect(timespan.toMonths()).toBe(14);
      expect(timespan.toWeeks()).toBe(64);
      expect(timespan.toDays()).toBe(453);
      expect(timespan.toHours()).toBe(10853);
      expect(timespan.toMinutes()).toBe(651186);
      expect(timespan.toSeconds()).toBe(39071167);
      expect(timespan.toMilliseconds()).toBe(39071167008);

      // Check the string representation of the Timespan object
      expect(timespan.toString()).toBe('1y 2M 3w 4d 5h 6m 7s 8ms');
    });

    it('should handle singular and plural units', () => {
      const timespan = Timespan.fromString('2years 1month 3weeks 4days');

      // Check the properties of the Timespan object
      expect(timespan.toYears()).toBe(2);
      expect(timespan.toMonths()).toBe(25);
      expect(timespan.toWeeks()).toBe(112);
      expect(timespan.toDays()).toBe(786);

      // Check the string representation of the Timespan object
      expect(timespan.toString()).toBe('2y 1M 3w 4d');
    });

    it('should handle different unit abbreviations', () => {
      const timespan = Timespan.fromString(
        '1yr 2mos 3wks 4dys 5hrs 6mins 7secs 8mss',
      );

      // Check the properties of the Timespan object
      expect(timespan.toYears()).toBe(1);
      expect(timespan.toMonths()).toBe(14);
      expect(timespan.toWeeks()).toBe(64);
      expect(timespan.toDays()).toBe(453);
      expect(timespan.toHours()).toBe(10853);
      expect(timespan.toMinutes()).toBe(651186);
      expect(timespan.toSeconds()).toBe(39071167);
      expect(timespan.toMilliseconds()).toBe(39071167008);

      // Check the string representation of the Timespan object
      expect(timespan.toString()).toBe('1y 2M 3w 4d 5h 6m 7s 8ms');
    });

    it('should throw an error for an invalid unit', () => {
      expect(() => {
        Timespan.fromString('1y 2M 3w 4d 5x');
      }).toThrow('Invalid date unit: x');
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

    it.each(allowedStrings)(
      'should return the correct string for %s',
      (inputString, expectedString) => {
        const outputString = Timespan.fromString(inputString).toString();
        expect(outputString).toBe(expectedString);
      },
    );

    it.each(blacklistedCharacters)(
      'should throw an error for input that contains invalid character %s',
      (character) => {
        expect(() => Timespan.fromString(character)).toThrowError(
          'Invalid input string',
        );
      },
    );

    it('should throw an error for input that contains invalid character " Hello World"', () => {
      expect(() => Timespan.fromString(' Hello World')).toThrowError(
        'Invalid date unit: Hello',
      );
    });

    it('should throw an error for input that contains invalid character "Hello\\tWorld"', () => {
      expect(() => Timespan.fromString('Hello\tWorld')).toThrowError(
        'Invalid date unit: World',
      );
    });

    it('should throw an error for input that contains invalid character "Hello\\nWorld"', () => {
      expect(() => Timespan.fromString('Hello\nWorld')).toThrowError(
        'Invalid unit',
      );
    });
  });

  describe('addToDate', () => {
    const startDate = new Date('2022-01-01T00:00:00Z');

    it('should add milliseconds to a date', () => {
      const amountToAdd = 500;
      const startDateInMilliseconds = startDate.getTime();
      const endDateInMilliseconds = new Date(
        startDate.getTime() + amountToAdd,
      ).getTime();
      const updatedDate = Timespan.fromMilliseconds(amountToAdd, startDate);
      const expected = endDateInMilliseconds - startDateInMilliseconds;
      expect(updatedDate.toMilliseconds()).toBe(expected);
    });

    it('should add seconds to a date', () => {
      const amountToAdd = 2;
      const startDateInMilliseconds = startDate.getTime();
      const endDateInMilliseconds = new Date(
        startDate.getTime() + amountToAdd,
      ).getTime();
      const updatedDate = Timespan.fromSeconds(amountToAdd, startDate);
      const expected = endDateInMilliseconds - startDateInMilliseconds;
      expect(updatedDate.toSeconds()).toBe(expected);
    });

    it('should add minutes to a date', () => {
      const amountToAdd = 2;
      const startDateInMilliseconds = startDate.getTime();
      const endDateInMilliseconds = new Date(
        startDate.getTime() + amountToAdd,
      ).getTime();
      const updatedDate = Timespan.fromMinutes(amountToAdd, startDate);
      const expected = endDateInMilliseconds - startDateInMilliseconds;
      expect(updatedDate.toMinutes()).toBe(expected);
    });

    it('should add hours to a date', () => {
      const amountToAdd = 2;
      const startDateInMilliseconds = startDate.getTime();
      const endDateInMilliseconds = new Date(
        startDate.getTime() + amountToAdd,
      ).getTime();
      const updatedDate = Timespan.fromHours(amountToAdd, startDate);
      const expected = endDateInMilliseconds - startDateInMilliseconds;
      expect(updatedDate.toHours()).toBe(expected);
    });

    it('should add days to a date', () => {
      const amountToAdd = 2;
      const startDateInMilliseconds = startDate.getTime();
      const endDateInMilliseconds = new Date(
        startDate.getTime() + amountToAdd,
      ).getTime();
      const updatedDate = Timespan.fromDays(amountToAdd, startDate);
      const expected = endDateInMilliseconds - startDateInMilliseconds;
      expect(updatedDate.toDays()).toBe(expected);
    });

    it('should add weeks to a date', () => {
      const amountToAdd = 2;
      const updatedDate = Timespan.fromWeeks(amountToAdd, startDate);
      const expected = 2;
      expect(updatedDate.toWeeks()).toBe(expected);
    });

    it('should add months to a date', () => {
      const amountToAdd = 3;
      const updatedDate = Timespan.fromMonths(amountToAdd, startDate);
      const expected = 3;
      expect(updatedDate.toMonths()).toBe(expected);
    });

    it('should add years to a date', () => {
      const amountToAdd = 2;
      const startDateInMilliseconds = startDate.getTime();
      const endDateInMilliseconds = new Date(
        startDate.getTime() + amountToAdd,
      ).getTime();
      const updatedDate = Timespan.fromYears(amountToAdd, startDate);
      const expected = endDateInMilliseconds - startDateInMilliseconds;
      expect(updatedDate.toYears()).toBe(expected);
    });

    it('should create timespan from milliseconds', () => {
      const amountToAdd = 500;
      const startDateInMilliseconds = startDate.getTime();
      const endDateInMilliseconds = new Date(
        startDate.getTime() + amountToAdd,
      ).getTime();
      const updatedDate = Timespan.fromMilliseconds(amountToAdd);
      const expected = endDateInMilliseconds - startDateInMilliseconds;
      expect(updatedDate.toMilliseconds()).toBe(expected);
    });

    it('should create timespan from seconds', () => {
      const amountToAdd = 2;
      const startDateInMilliseconds = startDate.getTime();
      const endDateInMilliseconds = new Date(
        startDate.getTime() + amountToAdd,
      ).getTime();
      const updatedDate = Timespan.fromSeconds(amountToAdd);
      const expected = endDateInMilliseconds - startDateInMilliseconds;
      expect(updatedDate.toSeconds()).toBe(expected);
    });

    it('should create timespan from minutes', () => {
      const amountToAdd = 2;
      const startDateInMilliseconds = startDate.getTime();
      const endDateInMilliseconds = new Date(
        startDate.getTime() + amountToAdd,
      ).getTime();
      const updatedDate = Timespan.fromMinutes(amountToAdd);
      const expected = endDateInMilliseconds - startDateInMilliseconds;
      expect(updatedDate.toMinutes()).toBe(expected);
    });

    it('should create timespan from hours', () => {
      const amountToAdd = 2;
      const startDateInMilliseconds = startDate.getTime();
      const endDateInMilliseconds = new Date(
        startDate.getTime() + amountToAdd,
      ).getTime();
      const updatedDate = Timespan.fromHours(amountToAdd);
      const expected = endDateInMilliseconds - startDateInMilliseconds;
      expect(updatedDate.toHours()).toBe(expected);
    });

    it('should create timespan from days', () => {
      const amountToAdd = 2;
      const startDateInMilliseconds = startDate.getTime();
      const endDateInMilliseconds = new Date(
        startDate.getTime() + amountToAdd,
      ).getTime();
      const updatedDate = Timespan.fromDays(amountToAdd);
      const expected = endDateInMilliseconds - startDateInMilliseconds;
      expect(updatedDate.toDays()).toBe(expected);
    });

    it('should create timespan from weeks', () => {
      const amountToAdd = 2;
      const updatedDate = Timespan.fromWeeks(amountToAdd);
      const expected = 2;
      expect(updatedDate.toWeeks()).toBe(expected);
    });

    it('sshould create timespan from months', () => {
      const amountToAdd = 3;
      const updatedDate = Timespan.fromMonths(amountToAdd);
      const expected = 3;
      expect(updatedDate.toMonths()).toBe(expected);
    });

    it('should create timespan from years', () => {
      const amountToAdd = 2;
      const startDateInMilliseconds = startDate.getTime();
      const endDateInMilliseconds = new Date(
        startDate.getTime() + amountToAdd,
      ).getTime();
      const updatedDate = Timespan.fromYears(amountToAdd);
      const expected = endDateInMilliseconds - startDateInMilliseconds;
      expect(updatedDate.toYears()).toBe(expected);
    });
  });
});
