import { Timespan } from './src';

const start = new Date('2022-01-01T06:24:00Z');
const end = new Date('2023-02-21T10:52:00Z');

const inputString =
  '1years 1months 2weeks 6days 17hours 58minutes 43seconds 200milliseconds';
const expectedTimeFrame: { [key: string]: number } = {
  years: 1,
  months: 1,
  weeks: 2,
  days: 6,
  hours: 17,
  minutes: 58,
  seconds: 43,
  milliseconds: 200,
};

// const timespan = new Timespan(start, end);
const timespan = Timespan.fromString(inputString);
const timeframe = timespan.toTimeframe();
console.group(start);
[
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
].forEach((unit) => {
  console.log(
    `[${unit.padEnd(12, ' ')}]\tReceived [${timeframe[unit]}] | Expected [${
      expectedTimeFrame[unit]
    }]\t | [${timeframe[unit] === expectedTimeFrame[unit] ? 'Pass' : 'Fail'}]`,
  );
});
console.log(
  `\n[${
    timespan.toString() === '1y 1M 2w 6d 17h 58m 43s 200ms' ? 'Pass' : 'Fail'
  }] => ${timespan.toString()}`,
);
console.groupEnd();
