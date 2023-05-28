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
      expect(timeframe.days).toBe(0);
    });

    it('should return the time span in weeks', () => {
      const timespan = new Timespan(start, end);
      const timeframe = timespan.toTimeframe();
      expect(timeframe.weeks).toBe(3);
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
      expect(timespan.toString()).toBe('1y 1M 3w 4h 28m');
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
      expect(timespan.toMonths()).toBe(13.682816055361402);
    });
  });

  describe('toYears', () => {
    it('should return the time span in years', () => {
      const timespan = new Timespan(start, end);
      expect(timespan.toYears()).toBe(1.1402359208523594);
    });
  });

  describe('fromString', () => {
    it('should create a Timespan object from a valid string input', () => {
      const timespan = Timespan.fromString('1y 2M 3w 4d 5h 6m 7s 8ms');

      // Check the properties of the Timespan object
      expect(timespan.toYears()).toBe(1.2334591263318113);
      expect(timespan.toMonths()).toBe(14.801493295167168);
      expect(timespan.toWeeks()).toBe(64.31608301587302);
      expect(timespan.toDays()).toBe(450.21258111111115);
      expect(timespan.toHours()).toBe(10805.101946666668);
      expect(timespan.toMinutes()).toBe(648306.1168000001);
      expect(timespan.toSeconds()).toBe(38898367.008);
      expect(timespan.toMilliseconds()).toBe(38898367008);

      // Check the string representation of the Timespan object
      expect(timespan.toString()).toBe('1y 2M 3w 4d 5h 6m 7s 8ms');
    });

    it('should handle singular and plural units', () => {
      const timespan = Timespan.fromString('2years 1month 3weeks 4days');

      // Check the properties of the Timespan object
      expect(timespan.toYears()).toBe(2.1506849315068495);
      expect(timespan.toMonths()).toBe(25.808190895133265);
      expect(timespan.toWeeks()).toBe(112.14285714285714);
      expect(timespan.toDays()).toBe(785);

      // Check the string representation of the Timespan object
      expect(timespan.toString()).toBe('2y 1M 3w 4d');
    });

    it('should handle different unit abbreviations', () => {
      const timespan = Timespan.fromString(
        '1yr 2mos 3wks 4dys 5hrs 6mins 7secs 8mss'
      );

      // Check the properties of the Timespan object
      expect(timespan.toYears()).toBe(1.2334591263318113);
      expect(timespan.toMonths()).toBe(14.801493295167168);
      expect(timespan.toWeeks()).toBe(64.31608301587302);
      expect(timespan.toDays()).toBe(450.21258111111115);
      expect(timespan.toHours()).toBe(10805.101946666668);
      expect(timespan.toMinutes()).toBe(648306.1168000001);
      expect(timespan.toSeconds()).toBe(38898367.008);
      expect(timespan.toMilliseconds()).toBe(38898367008);

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
        'Invalid unit'
      );
    });
  });
});
